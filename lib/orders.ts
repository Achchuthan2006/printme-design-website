import { CheckoutPayload, OrderSnapshot } from "@/types";
import { getInitialPaymentStatus } from "@/lib/backend/workflows";

export function createOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PM-${datePart}-${randomPart}`;
}

export function buildOrderSnapshot(payload: CheckoutPayload): OrderSnapshot {
  const payableItems = payload.items.filter((item) => !item.quoteOnly);
  const payableCents = Math.round(
    payableItems.reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0) * 100,
  );

  return {
    orderNumber: createOrderNumber(),
    customer: payload.customer,
    fulfillmentMethod: payload.fulfillmentMethod,
    deliveryAddress: payload.deliveryAddress,
    orderNotes: payload.orderNotes,
    items: payload.items,
    subtotalCents: Math.round(payload.subtotal * 100),
    payableCents,
    quoteReviewRequired: payload.items.some((item) => item.quoteOnly),
    paymentStatus: getInitialPaymentStatus(payload.paymentMode, false),
    createdAt: new Date().toISOString(),
  };
}

export async function persistOrderSnapshot(_order: OrderSnapshot) {
  // TODO: insert into Supabase orders/order_items and link uploads, customer profile, invoice, and notifications.
  return { skipped: true };
}
