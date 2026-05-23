import sgMail from "@sendgrid/mail";
import {
  buildAdminNotificationEmail,
  buildCustomerConfirmationEmail,
  buildOrderConfirmationEmail,
  configureSendGrid,
} from "@/lib/sendgrid";
import { env, isSendGridConfigured } from "@/lib/env";
import { QuoteRequestApiInput } from "@/lib/backend/schemas";
import { CheckoutPayload, OrderSnapshot } from "@/types";
import { logError } from "@/lib/logger";

export type NotificationTrigger =
  | "quote.received"
  | "order.received"
  | "payment.confirmed"
  | "upload.received"
  | "artwork.needs_changes"
  | "ready_for_pickup";

export async function dispatchQuoteReceivedNotifications(input: QuoteRequestApiInput) {
  if (!isSendGridConfigured()) {
    return { skipped: true, reason: "SendGrid environment variables are not configured." };
  }

  configureSendGrid();
  await sgMail.send(buildCustomerConfirmationEmail(input));
  await sgMail.send(buildAdminNotificationEmail(input));
  return { skipped: false };
}

export async function dispatchOrderReceivedNotifications(params: {
  order: OrderSnapshot;
  payload: CheckoutPayload;
  demo?: boolean;
}) {
  if (!isSendGridConfigured()) {
    return { skipped: true, reason: "SendGrid environment variables are not configured." };
  }

  try {
    configureSendGrid();
    await sgMail.send(buildOrderConfirmationEmail(params.order.orderNumber, params.payload.customer.email));
    return { skipped: false };
  } catch (error) {
    logError("Order notification dispatch failed", error, { orderNumber: params.order.orderNumber, demo: params.demo });
    return { skipped: true, reason: "Order notification dispatch failed." };
  }
}

export function getAutomationReadinessSummary() {
  return {
    webhookConfigured: Boolean(env.stripeWebhookSecret),
    emailConfigured: isSendGridConfigured(),
    preparedTriggers: [
      "welcome email",
      "password reset",
      "quote received",
      "quote updated",
      "order placed",
      "payment confirmed",
      "upload received",
      "artwork needs changes",
      "ready for pickup",
      "invoice notice",
      "support follow-up",
    ],
  };
}
