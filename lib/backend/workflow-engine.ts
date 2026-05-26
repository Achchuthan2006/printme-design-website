import {
  createPaymentAuditRecord,
  recordNotificationEvent,
  updateOrderPaymentState,
} from "@/lib/backend/repository";
import { OrderWorkflowStatus, PaymentWorkflowStatus, WorkflowEventType } from "@/lib/backend/workflows";

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
}
