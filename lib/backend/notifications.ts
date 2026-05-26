import sgMail from "@sendgrid/mail";
import {
  buildAdminNotificationEmail,
  buildArtworkIssueEmail,
  buildCustomerConfirmationEmail,
  buildInvoiceReceiptEmail,
  buildOrderConfirmationEmail,
  buildPaymentConfirmedEmail,
  buildReadyForPickupEmail,
  buildSupportAcknowledgementEmail,
  buildUploadReceivedEmail,
  buildWelcomeEmail,
  configureSendGrid,
} from "@/lib/sendgrid";
import { env, isSendGridConfigured } from "@/lib/env";
import { QuoteRequestApiInput } from "@/lib/backend/schemas";
import { CheckoutPayload, OrderSnapshot } from "@/types";
import { logError } from "@/lib/logger";
import { recordEmailDeliveryEvent, recordNotificationEvent } from "@/lib/backend/repository";

export type NotificationTrigger =
  | "account.welcome"
  | "quote.received"
  | "quote.updated"
  | "order.received"
  | "payment.confirmed"
  | "upload.received"
  | "artwork.needs_changes"
  | "ready_for_pickup"
  | "invoice.receipt"
  | "support.acknowledged";

async function deliverTrackedEmail(params: {
  entityType: "quote" | "order" | "upload" | "support";
  entityId: string;
  trigger: NotificationTrigger;
  recipient: string;
  message: Parameters<typeof sgMail.send>[0];
}) {
  const notificationResult = await recordNotificationEvent({
    entityType: params.entityType,
    entityId: params.entityId,
    triggerName: params.trigger,
    provider: isSendGridConfigured() ? "sendgrid" : "system",
    deliveryStatus: isSendGridConfigured() ? "pending" : "skipped",
    payload: {
      recipient: params.recipient,
    },
  });

  if (!isSendGridConfigured()) {
    await recordEmailDeliveryEvent({
      entityType: params.entityType,
      entityId: params.entityId,
      triggerName: params.trigger,
      recipient: params.recipient,
      provider: "sendgrid",
      deliveryStatus: "skipped",
      payload: {
        reason: "SendGrid environment variables are not configured.",
      },
    });

    return { skipped: true, reason: "SendGrid environment variables are not configured." };
  }

  try {
    configureSendGrid();
    const [response] = await sgMail.send(params.message);
    const notificationId = notificationResult.persisted ? undefined : undefined;
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
    await recordEmailDeliveryEvent({
      notificationId,
      entityType: params.entityType,
      entityId: params.entityId,
      triggerName: params.trigger,
      recipient: params.recipient,
      provider: "sendgrid",
      providerMessageId: response.headers?.get("x-message-id") ?? undefined,
      deliveryStatus: "sent",
      payload: {
        subject: "subject" in params.message ? params.message.subject : undefined,
      },
      sentAt: new Date().toISOString(),
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
    await recordEmailDeliveryEvent({
      entityType: params.entityType,
      entityId: params.entityId,
      triggerName: params.trigger,
      recipient: params.recipient,
      provider: "sendgrid",
      deliveryStatus: "failed",
      payload: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return { skipped: true, reason: "Email delivery failed." };
  }
}

export async function dispatchWelcomeNotification(params: {
  profileId: string;
  customerEmail: string;
  customerFullName?: string;
}) {
  return deliverTrackedEmail({
    entityType: "support",
    entityId: params.profileId,
    trigger: "account.welcome",
    recipient: params.customerEmail,
    message: buildWelcomeEmail(params.customerEmail, params.customerFullName),
  });
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

export async function dispatchArtworkNeedsChangesNotification(params: {
  fileId: string;
  customerEmail: string;
  fileName: string;
  issueSummary: string;
}) {
  return deliverTrackedEmail({
    entityType: "upload",
    entityId: params.fileId,
    trigger: "artwork.needs_changes",
    recipient: params.customerEmail,
    message: buildArtworkIssueEmail(params.customerEmail, params.fileName, params.issueSummary),
  });
}

export async function dispatchReadyForPickupNotification(params: {
  orderNumber: string;
  customerEmail: string;
}) {
  return deliverTrackedEmail({
    entityType: "order",
    entityId: params.orderNumber,
    trigger: "ready_for_pickup",
    recipient: params.customerEmail,
    message: buildReadyForPickupEmail(params.orderNumber, params.customerEmail),
  });
}

export async function dispatchSupportAcknowledgementNotification(params: {
  ticketNumber: string;
  customerEmail: string;
  subject: string;
}) {
  return deliverTrackedEmail({
    entityType: "support",
    entityId: params.ticketNumber,
    trigger: "support.acknowledged",
    recipient: params.customerEmail,
    message: buildSupportAcknowledgementEmail(params.customerEmail, params.subject),
  });
}

export async function dispatchInvoiceReceiptNotification(params: {
  invoiceNumber: string;
  customerEmail: string;
  orderNumber?: string;
}) {
  return deliverTrackedEmail({
    entityType: "order",
    entityId: params.orderNumber ?? params.invoiceNumber,
    trigger: "invoice.receipt",
    recipient: params.customerEmail,
    message: buildInvoiceReceiptEmail(params.customerEmail, params.invoiceNumber, params.orderNumber),
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
