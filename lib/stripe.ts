import Stripe from "stripe";
import { CartItem, OrderSnapshot } from "@/types";
import { env } from "@/lib/env";
import { stripeCheckoutMetadataSchema } from "@/lib/backend/schemas";

export interface CheckoutSessionInput {
  order: OrderSnapshot;
  mode: "deposit" | "full";
  successUrl: string;
  cancelUrl: string;
  idempotencyKey?: string;
  customerId?: string | null;
}

export function getStripeClient() {
  if (!env.stripeSecretKey) return null;
  return new Stripe(env.stripeSecretKey);
}

function buildLineItems(
  items: CartItem[],
  paymentMode: "deposit" | "full",
): NonNullable<Stripe.Checkout.SessionCreateParams["line_items"]> {
  return items
    .filter((item) => !item.quoteOnly && (item.estimatedTotal || item.unitPrice) > 0)
    .map((item) => {
      const unitAmount = Math.max(100, Math.round((item.estimatedTotal || item.unitPrice) * 100));
      const depositAmount = Math.max(100, Math.round(unitAmount * 0.5));

      return {
        quantity: item.quantity,
        price_data: {
          currency: "cad",
          unit_amount: paymentMode === "deposit" ? depositAmount : unitAmount,
          product_data: {
            name: item.title,
            description: item.optionLabels.map((option) => `${option.label}: ${option.value}`).join(" | ").slice(0, 500),
          },
        },
      };
    });
}

export async function createCheckoutSession(input: CheckoutSessionInput) {
  const stripe = getStripeClient();

  if (!stripe) {
    return {
      url: `${input.successUrl}&demo=1`,
      provider: "stripe",
      status: "demo",
    };
  }

  const lineItems = buildLineItems(input.order.items, input.mode);

  if (lineItems.length === 0) {
    return {
      url: `${input.successUrl}&review=1`,
      provider: "stripe",
      status: "quote-review",
    };
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      ...(input.customerId ? { customer: input.customerId } : { customer_email: input.order.customer.email }),
      line_items: lineItems,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      payment_intent_data: {
        metadata: {
          orderNumber: input.order.orderNumber,
          paymentMode: input.mode,
        },
      },
      metadata: {
        orderNumber: input.order.orderNumber,
        paymentMode: input.mode,
        quoteReviewRequired: String(input.order.quoteReviewRequired),
      },
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
  );

  return {
    url: session.url ?? input.cancelUrl,
    provider: "stripe",
    status: "created",
    sessionId: session.id,
  };
}

export function verifyStripeWebhookSignature(payload: string, signature: string) {
  const stripe = getStripeClient();
  if (!stripe || !env.stripeWebhookSecret) {
    throw new Error("Stripe webhook verification is not configured.");
  }

  return stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
}

export function parseCheckoutSessionMetadata(metadata: Stripe.Metadata | null | undefined) {
  const parsed = stripeCheckoutMetadataSchema.safeParse(metadata ?? {});
  if (!parsed.success) return null;
  return parsed.data;
}
