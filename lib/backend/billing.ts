import Stripe from "stripe";
import { env } from "@/lib/env";
import {
  getPrivateBillingCustomer,
  getPrivatePaymentRecordByOrderNumber,
  getProfileByEmail,
  upsertPrivateBillingCustomer,
  upsertPrivatePaymentRecord,
} from "@/lib/backend/repository";
import { OrderSnapshot } from "@/types";

function getStripeServerClient() {
  if (!env.stripeSecretKey) return null;
  return new Stripe(env.stripeSecretKey);
}

export async function ensureStripeCustomer(input: {
  email: string;
  fullName?: string;
  phone?: string;
}) {
  const profile = await getProfileByEmail(input.email);
  const existing = await getPrivateBillingCustomer({ profileId: profile?.id ?? null, email: input.email });

  if (existing?.stripe_customer_id) {
    return {
      stripeCustomerId: existing.stripe_customer_id,
      profileId: existing.profile_id ?? profile?.id ?? null,
      created: false,
    };
  }

  const stripe = getStripeServerClient();
  if (!stripe) {
    return {
      stripeCustomerId: null,
      profileId: profile?.id ?? null,
      created: false,
    };
  }

  const listed = await stripe.customers.list({ email: input.email, limit: 1 });
  const stripeCustomer =
    listed.data[0] ??
    (await stripe.customers.create({
      email: input.email,
      name: input.fullName,
      phone: input.phone,
      metadata: {
        profileId: profile?.id ?? "",
      },
    }));

  await upsertPrivateBillingCustomer({
    profileId: profile?.id ?? null,
    email: input.email,
    stripeCustomerId: stripeCustomer.id,
    customerName: input.fullName,
    phone: input.phone,
    metadata: {
      source: listed.data[0] ? "stripe-list" : "stripe-create",
    },
  });

  return {
    stripeCustomerId: stripeCustomer.id,
    profileId: profile?.id ?? null,
    created: !listed.data[0],
  };
}

export async function recordCheckoutBillingRecord(input: {
  order: OrderSnapshot;
  paymentMode: "full" | "deposit";
  stripeCustomerId?: string | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  currency?: string;
}) {
  const profile = await getProfileByEmail(input.order.customer.email);
  const existing = await getPrivatePaymentRecordByOrderNumber(input.order.orderNumber);

  return upsertPrivatePaymentRecord({
    orderNumber: input.order.orderNumber,
    profileId: profile?.id ?? existing?.profile_id ?? null,
    providerCustomerId: input.stripeCustomerId ?? existing?.provider_customer_id ?? null,
    providerCheckoutSessionId: input.stripeSessionId ?? existing?.provider_checkout_session_id ?? null,
    providerPaymentIntentId: input.stripePaymentIntentId ?? existing?.provider_payment_intent_id ?? null,
    paymentMode: input.paymentMode,
    status: existing?.status ?? (input.stripeSessionId ? "pending" : "demo"),
    amountAuthorizedCents: input.order.payableCents,
    amountCapturedCents: existing?.amount_captured_cents ?? null,
    amountRefundedCents: existing?.amount_refunded_cents ?? 0,
    currency: input.currency ?? existing?.currency ?? "cad",
    billingEmail: input.order.customer.email,
    metadata: {
      quoteReviewRequired: input.order.quoteReviewRequired,
      itemCount: input.order.items.length,
    },
  });
}
