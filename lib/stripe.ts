import Stripe from "stripe";
import { CartItem, OrderSnapshot } from "@/types";
import { env } from "@/lib/env";

export interface CheckoutSessionInput {
  order: OrderSnapshot;
  mode: "deposit" | "full";
  successUrl: string;
  cancelUrl: string;
}

function getStripeClient() {
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

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.order.customer.email,
    line_items: lineItems,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      orderNumber: input.order.orderNumber,
      paymentMode: input.mode,
      quoteReviewRequired: String(input.order.quoteReviewRequired),
      // TODO: persist order snapshot in Supabase before creating the Stripe session and store order_id here.
    },
  });

  return {
    url: session.url ?? input.cancelUrl,
    provider: "stripe",
    status: "created",
    sessionId: session.id,
  };
}
