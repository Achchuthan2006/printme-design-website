export const quoteWorkflowStatuses = [
  "submitted",
  "under_review",
  "waiting_for_files",
  "quoted",
  "approved",
  "converted_to_order",
  "closed",
] as const;

export const orderWorkflowStatuses = [
  "draft",
  "quote_review_required",
  "payment_pending",
  "paid",
  "in_production",
  "ready_for_pickup",
  "shipped_delivered",
  "completed",
  "cancelled",
  "on_hold",
] as const;

export const paymentWorkflowStatuses = [
  "pending",
  "requires_action",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "demo",
] as const;

export const uploadWorkflowStatuses = [
  "uploaded",
  "awaiting_review",
  "needs_changes",
  "proof_required",
  "approved_for_print",
  "ready_for_production",
] as const;

export type QuoteWorkflowStatus = (typeof quoteWorkflowStatuses)[number];
export type OrderWorkflowStatus = (typeof orderWorkflowStatuses)[number];
export type PaymentWorkflowStatus = (typeof paymentWorkflowStatuses)[number];
export type UploadWorkflowStatus = (typeof uploadWorkflowStatuses)[number];

export const workflowEventTypes = [
  "quote.submitted",
  "quote.review_requested",
  "quote.updated",
  "quote.approved",
  "quote.converted_to_order",
  "order.created",
  "order.payment_pending",
  "order.payment_confirmed",
  "order.payment_failed",
  "order.status_updated",
  "upload.received",
  "upload.review_requested",
  "upload.approved",
  "support.message_received",
  "system.warning",
] as const;

export type WorkflowEventType = (typeof workflowEventTypes)[number];

export function getInitialQuoteStatus(): QuoteWorkflowStatus {
  return "submitted";
}

export function getInitialOrderStatus(hasQuoteReview: boolean): OrderWorkflowStatus {
  return hasQuoteReview ? "quote_review_required" : "payment_pending";
}

export function getInitialPaymentStatus(mode: "full" | "deposit", demo = false): PaymentWorkflowStatus {
  if (demo) return "demo";
  return mode === "deposit" ? "requires_action" : "pending";
}
