import sgMail from "@sendgrid/mail";
import {
  buildAdminNotificationEmail,
  buildCustomerConfirmationEmail,
  buildOrderConfirmationEmail,
  buildPaymentConfirmedEmail,
  buildUploadReceivedEmail,
  configureSendGrid,
} from "@/lib/sendgrid";
import { env, isSendGridConfigured } from "@/lib/env";
import { QuoteRequestApiInput } from "@/lib/backend/schemas";
import { CheckoutPayload, OrderSnapshot } from "@/types";
import { logError } from "@/lib/logger";
import { recordNotificationEvent } from "@/lib/backend/repository";

export type NotificationTrigger =
  | "quote.received"
  | "order.received"
  | "payment.confirmed"
  | "upload.received"
  | "artwork.needs_changes"
  | "ready_for_pickup";

async function deliverTrackedEmail(params: {
  entityType: "quote" | "order" | "upload" | "support";
  entityId: string;
  trigger: NotificationTrigger;
  recipient: string;
  message: Parameters<typeof sgMail.send>[0];
}) {
  if (!isSendGridConfigured()) {
    await recordNotificationEvent({
      entityType: params.entityType,
      entityId: params.entityId,
      triggerName: params.trigger,
      provider: "system",
      deliveryStatus: "skipped",
      payload: {
        recipient: params.recipient,
        reason: "SendGrid environment variables are not configured.",
      },
    });

    return { skipped: true, reason: "SendGrid environment variables are not configured." };
  }

  try {
    configureSendGrid();
    await sgMail.send(params.message);
    await recordNotificationEvent({
      entityType: params.entityType,
      entityId: params.entityId,
      triggerName: params.trigger,
      provider: "sendgrid",
      deliveryStatus: "sent",
      deliveredAt: new Date().toISOString(),
      payload: {
        recipient: params.recipient,
        subject: "subject" in params.message ? params.message.subject : undefined,
      },
    });
    return { skipped: false };
  } catch (error) {
    logError("Tracked email dispatch failed", error, {
      entityType: params.entityType,
      entityId: params.entityId,
      trigger: params.trigger,
      recipient: params.recipient,
    });
    await recordNotificationEvent({
      entityType: params.entityType,
      entityId: params.entityId,
      triggerName: params.trigger,
      provider: "sendgrid",
      deliveryStatus: "failed",
      payload: {
        recipient: params.recipient,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return { skipped: true, reason: "Email delivery failed." };
  }
}

export async function dispatchQuoteReceivedNotifications(params: { quoteNumber: string; input: QuoteRequestApiInput }) {
  const customer = await deliverTrackedEmail({
    entityType: "quote",
    entityId: params.quoteNumber,
    trigger: "quote.received",
    recipient: params.input.email,
    message: buildCustomerConfirmationEmail(params.input),
  });
  const adminRecipient = env.sendGridAdminEmail ?? "hello@printmedesign.com";
  const admin = await deliverTrackedEmail({
    entityType: "quote",
    entityId: params.quoteNumber,
    trigger: "quote.received",
    recipient: adminRecipient,
    message: buildAdminNotificationEmail(params.input),
  });
  return {
    skipped: customer.skipped && admin.skipped,
    customer,
    admin,
  };
}

export async function dispatchOrderReceivedNotifications(params: {
  order: OrderSnapshot;
  payload: CheckoutPayload;
  demo?: boolean;
}) {
  return deliverTrackedEmail({
    entityType: "order",
    entityId: params.order.orderNumber,
    trigger: "order.received",
    recipient: params.payload.customer.email,
    message: buildOrderConfirmationEmail(params.order.orderNumber, params.payload.customer.email),
  });
}

export async function dispatchPaymentConfirmedNotification(params: {
  orderNumber: string;
  customerEmail: string;
  customerFullName?: string;
}) {
  return deliverTrackedEmail({
    entityType: "order",
    entityId: params.orderNumber,
    trigger: "payment.confirmed",
    recipient: params.customerEmail,
    message: buildPaymentConfirmedEmail(params.orderNumber, params.customerEmail, params.customerFullName),
  });
}

export async function dispatchUploadReceivedNotification(params: {
  fileId: string;
  customerEmail: string;
  fileName: string;
  relatedLabel?: string;
}) {
  return deliverTrackedEmail({
    entityType: "upload",
    entityId: params.fileId,
    trigger: "upload.received",
    recipient: params.customerEmail,
    message: buildUploadReceivedEmail(params.customerEmail, params.fileName, params.relatedLabel),
  });
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
