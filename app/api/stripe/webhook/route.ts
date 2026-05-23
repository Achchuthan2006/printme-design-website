import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createPaymentAuditRecord, updateOrderPaymentState } from "@/lib/backend/repository";
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

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = getSessionOrderNumber(session);

        if (orderNumber) {
          await updateOrderPaymentState({
            orderNumber,
            paymentStatus: "paid",
            workflowStatus: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            eventType: "order.payment_confirmed",
          });

          await createPaymentAuditRecord({
            orderNumber,
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            status: "paid",
            amountCents: session.amount_total ?? undefined,
            currency: session.currency ?? "cad",
            rawEventType: event.type,
          });
        }

        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = getSessionOrderNumber(session);

        if (orderNumber) {
          await updateOrderPaymentState({
            orderNumber,
            paymentStatus: "cancelled",
            workflowStatus: "payment_pending",
            stripeSessionId: session.id,
            eventType: "order.status_updated",
          });

          await createPaymentAuditRecord({
            orderNumber,
            stripeSessionId: session.id,
            status: "cancelled",
            amountCents: session.amount_total ?? undefined,
            currency: session.currency ?? "cad",
            rawEventType: event.type,
          });
        }

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;

        if (orderNumber) {
          await updateOrderPaymentState({
            orderNumber,
            paymentStatus: "failed",
            workflowStatus: "payment_pending",
            stripePaymentIntentId: paymentIntent.id,
            eventType: "order.payment_failed",
          });

          await createPaymentAuditRecord({
            orderNumber,
            stripePaymentIntentId: paymentIntent.id,
            status: "failed",
            amountCents: paymentIntent.amount ?? undefined,
            currency: paymentIntent.currency ?? "cad",
            rawEventType: event.type,
          });
        }

        break;
      }
      default:
        break;
    }

    logInfo("Stripe webhook processed", { eventType: event.type });
    return NextResponse.json({ received: true });
  } catch (error) {
    logError("Stripe webhook handling failed", error);
    return NextResponse.json({ message: "Webhook handling failed." }, { status: 400 });
  }
}
