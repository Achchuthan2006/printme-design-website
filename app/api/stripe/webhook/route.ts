import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dispatchPaymentConfirmedNotification } from "@/lib/backend/notifications";
import { createPayloadFingerprint } from "@/lib/backend/idempotency";
import {
  findIdempotencyRecord,
  getOrderNotificationContext,
  getOrderPaymentSnapshot,
  persistIdempotencyRecord,
} from "@/lib/backend/repository";
import { applyPaymentWorkflowTransition } from "@/lib/backend/workflow-engine";
import { logError, logInfo } from "@/lib/logger";
import { parseCheckoutSessionMetadata, verifyStripeWebhookSignature } from "@/lib/stripe";

function getSessionOrderNumber(session: Stripe.Checkout.Session) {
  const metadata = parseCheckoutSessionMetadata(session.metadata);
  return metadata?.orderNumber ?? null;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
    }

    const payload = await request.text();
    const event = verifyStripeWebhookSignature(payload, signature);
    const requestHash = createPayloadFingerprint(payload);
    const existing = await findIdempotencyRecord("stripe-webhook", event.id);

    if (existing) {
      if (existing.requestHash !== requestHash) {
        return NextResponse.json({ message: "Webhook replay payload mismatch." }, { status: 409 });
      }

      return NextResponse.json({ received: true, replayed: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = getSessionOrderNumber(session);

        if (orderNumber) {
          const snapshot = await getOrderPaymentSnapshot(orderNumber);

          await applyPaymentWorkflowTransition({
            orderNumber,
            fromStatus: snapshot?.paymentStatus ?? "pending",
            toStatus: "paid",
            workflowStatus: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            amountCents: session.amount_total ?? undefined,
            currency: session.currency ?? "cad",
            rawEventType: event.type,
            eventType: "order.payment_confirmed",
          });

          const orderContext = await getOrderNotificationContext(orderNumber);
          if (orderContext?.customerEmail) {
            await dispatchPaymentConfirmedNotification({
              orderNumber,
              customerEmail: orderContext.customerEmail,
              customerFullName: orderContext.customerFullName,
            });
          }
        }

        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = getSessionOrderNumber(session);

        if (orderNumber) {
          const snapshot = await getOrderPaymentSnapshot(orderNumber);

          await applyPaymentWorkflowTransition({
            orderNumber,
            fromStatus: snapshot?.paymentStatus ?? "pending",
            toStatus: "cancelled",
            workflowStatus: "payment_pending",
            stripeSessionId: session.id,
            amountCents: session.amount_total ?? undefined,
            currency: session.currency ?? "cad",
            rawEventType: event.type,
            eventType: "order.status_updated",
          });
        }

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;

        if (orderNumber) {
          const snapshot = await getOrderPaymentSnapshot(orderNumber);

          await applyPaymentWorkflowTransition({
            orderNumber,
            fromStatus: snapshot?.paymentStatus ?? "pending",
            toStatus: "failed",
            workflowStatus: "payment_pending",
            stripePaymentIntentId: paymentIntent.id,
            amountCents: paymentIntent.amount ?? undefined,
            currency: paymentIntent.currency ?? "cad",
            rawEventType: event.type,
            eventType: "order.payment_failed",
          });
        }

        break;
      }
      default:
        break;
    }

    await persistIdempotencyRecord({
      scope: "stripe-webhook",
      key: event.id,
      requestHash,
      statusCode: 200,
      responseBody: { received: true, eventType: event.type },
    });

    logInfo("Stripe webhook processed", { eventType: event.type });
    return NextResponse.json({ received: true });
  } catch (error) {
    logError("Stripe webhook handling failed", error);
    return NextResponse.json({ message: "Webhook handling failed." }, { status: 400 });
  }
}
