import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dispatchPaymentConfirmedNotification } from "@/lib/backend/notifications";
import { createPayloadFingerprint } from "@/lib/backend/idempotency";
import {
  findIdempotencyRecord,
  getPrivatePaymentRecordByOrderNumber,
  getOrderNotificationContext,
  getOrderPaymentSnapshot,
  persistIdempotencyRecord,
  persistWebhookEventRecord,
} from "@/lib/backend/repository";
import { applyPaymentWorkflowTransition } from "@/lib/backend/workflow-engine";
import { logError, logInfo } from "@/lib/logger";
import { parseCheckoutSessionMetadata, verifyStripeWebhookSignature } from "@/lib/stripe";

function getSessionOrderNumber(session: Stripe.Checkout.Session) {
  const metadata = parseCheckoutSessionMetadata(session.metadata);
  return metadata?.orderNumber ?? null;
}

async function handlePaymentTransition(params: {
  orderNumber: string;
  toStatus: "paid" | "failed" | "cancelled" | "refunded";
  workflowStatus?: "paid" | "payment_pending" | "on_hold";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amountCents?: number;
  currency?: string;
  rawEventType: string;
  eventType: "order.payment_confirmed" | "order.payment_failed" | "order.status_updated";
}) {
  const snapshot = await getOrderPaymentSnapshot(params.orderNumber);

  await applyPaymentWorkflowTransition({
    orderNumber: params.orderNumber,
    fromStatus: snapshot?.paymentStatus ?? "pending",
    toStatus: params.toStatus,
    workflowStatus: params.workflowStatus,
    stripeSessionId: params.stripeSessionId,
    stripePaymentIntentId: params.stripePaymentIntentId,
    amountCents: params.amountCents,
    currency: params.currency,
    rawEventType: params.rawEventType,
    eventType: params.eventType,
  });
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

    await persistWebhookEventRecord({
      provider: "stripe",
      providerEventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      payload: event.data.object as unknown as Record<string, unknown>,
      processingStatus: "received",
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = getSessionOrderNumber(session);

        if (orderNumber) {
          await handlePaymentTransition({
            orderNumber,
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
          await handlePaymentTransition({
            orderNumber,
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
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;

        if (orderNumber) {
          await handlePaymentTransition({
            orderNumber,
            toStatus: "paid",
            workflowStatus: "paid",
            stripePaymentIntentId: paymentIntent.id,
            amountCents: paymentIntent.amount_received ?? paymentIntent.amount ?? undefined,
            currency: paymentIntent.currency ?? "cad",
            rawEventType: event.type,
            eventType: "order.payment_confirmed",
          });
        }

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;

        if (orderNumber) {
          await handlePaymentTransition({
            orderNumber,
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
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : undefined;
        const chargeOrderNumber = charge.metadata.orderNumber;

        if (paymentIntentId) {
          const paymentRecord = chargeOrderNumber ? await getPrivatePaymentRecordByOrderNumber(chargeOrderNumber) : null;
          const orderNumber = chargeOrderNumber || paymentRecord?.order_number;

          if (orderNumber) {
            await handlePaymentTransition({
              orderNumber,
              toStatus: "refunded",
              workflowStatus: "on_hold",
              stripePaymentIntentId: paymentIntentId,
              amountCents: charge.amount_refunded ?? charge.amount ?? undefined,
              currency: charge.currency ?? "cad",
              rawEventType: event.type,
              eventType: "order.status_updated",
            });
          }
        }

        break;
      }
      default:
        break;
    }

    await persistWebhookEventRecord({
      provider: "stripe",
      providerEventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      payload: event.data.object as unknown as Record<string, unknown>,
      processingStatus: "processed",
    });

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
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    logError("Stripe webhook handling failed", error);
    try {
      const payload = await request.clone().text();
      const signature = request.headers.get("stripe-signature");
      if (signature) {
        const event = verifyStripeWebhookSignature(payload, signature);
        await persistWebhookEventRecord({
          provider: "stripe",
          providerEventId: event.id,
          eventType: event.type,
          livemode: event.livemode,
          payload: event.data.object as unknown as Record<string, unknown>,
          processingStatus: "failed",
          processingError: message,
        });
      }
    } catch {
      // Ignore nested webhook logging failures.
    }
    return NextResponse.json({ message: "Webhook handling failed." }, { status: 400 });
  }
}
