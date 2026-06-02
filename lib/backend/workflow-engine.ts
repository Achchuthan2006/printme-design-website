import {
  createPaymentAuditRecord,
  getPrivatePaymentRecordByOrderNumber,
  recordNotificationEvent,
  upsertPrivatePaymentRecord,
  updateOrderPaymentState,
} from "@/lib/backend/repository";
import { OrderWorkflowStatus, PaymentWorkflowStatus, WorkflowEventType } from "@/lib/backend/workflows";
import { CheckoutPaymentMode } from "@/types";

const paymentStatusTransitions: Record<PaymentWorkflowStatus, PaymentWorkflowStatus[]> = {
  pending: ["requires_action", "paid", "failed", "cancelled", "refunded", "demo"],
  requires_action: ["paid", "failed", "cancelled", "refunded"],
  paid: ["refunded"],
  failed: ["pending", "requires_action", "cancelled"],
  cancelled: [],
  refunded: [],
  demo: ["pending", "paid", "cancelled"],
};

function canTransitionPayment(from: PaymentWorkflowStatus, to: PaymentWorkflowStatus) {
  return from === to || paymentStatusTransitions[from]?.includes(to);
}

export async function applyPaymentWorkflowTransition(params: {
  orderNumber: string;
  fromStatus: PaymentWorkflowStatus;
  toStatus: PaymentWorkflowStatus;
  workflowStatus?: OrderWorkflowStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amountCents?: number;
  currency?: string;
  rawEventType?: string;
  eventType: WorkflowEventType;
}) {
  if (!canTransitionPayment(params.fromStatus, params.toStatus)) {
    await recordNotificationEvent({
      entityType: "order",
      entityId: params.orderNumber,
      triggerName: "payment.confirmed",
      provider: "system",
      deliveryStatus: "failed",
      payload: {
        reason: "Invalid payment transition attempted.",
        fromStatus: params.fromStatus,
        toStatus: params.toStatus,
      },
    });
    throw new Error(`Invalid payment transition from ${params.fromStatus} to ${params.toStatus}.`);
  }

  await updateOrderPaymentState({
    orderNumber: params.orderNumber,
    paymentStatus: params.toStatus,
    workflowStatus: params.workflowStatus,
    stripeSessionId: params.stripeSessionId,
    stripePaymentIntentId: params.stripePaymentIntentId,
    eventType: params.eventType,
  });

  await createPaymentAuditRecord({
    orderNumber: params.orderNumber,
    stripeSessionId: params.stripeSessionId,
    stripePaymentIntentId: params.stripePaymentIntentId,
    status: params.toStatus,
    amountCents: params.amountCents,
    currency: params.currency,
    rawEventType: params.rawEventType,
  });

  const existing = await getPrivatePaymentRecordByOrderNumber(params.orderNumber);
  await upsertPrivatePaymentRecord({
    orderNumber: params.orderNumber,
    profileId: existing?.profile_id ?? null,
    providerCustomerId: existing?.provider_customer_id ?? null,
    providerCheckoutSessionId: params.stripeSessionId ?? existing?.provider_checkout_session_id ?? null,
    providerPaymentIntentId: params.stripePaymentIntentId ?? existing?.provider_payment_intent_id ?? null,
    paymentMode: (existing?.payment_mode ?? "full") as CheckoutPaymentMode,
    status: params.toStatus,
    amountAuthorizedCents: existing?.amount_authorized_cents ?? params.amountCents ?? null,
    amountCapturedCents: params.toStatus === "paid" ? params.amountCents ?? existing?.amount_captured_cents ?? null : existing?.amount_captured_cents ?? null,
    amountRefundedCents: params.toStatus === "refunded" ? params.amountCents ?? existing?.amount_refunded_cents ?? 0 : existing?.amount_refunded_cents ?? 0,
    currency: params.currency ?? existing?.currency ?? "cad",
    billingEmail: existing?.billing_email ?? null,
    metadata: {
      ...((existing?.metadata as Record<string, unknown> | undefined) ?? {}),
      lastWebhookEventType: params.rawEventType,
    },
  });
}
