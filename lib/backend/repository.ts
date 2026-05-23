import { env, isSupabaseServerConfigured } from "@/lib/env";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase";
import { QuoteRequestApiInput, RequestMeta } from "@/lib/backend/schemas";
import {
  getInitialOrderStatus,
  getInitialPaymentStatus,
  getInitialQuoteStatus,
  OrderWorkflowStatus,
  PaymentWorkflowStatus,
  QuoteWorkflowStatus,
  WorkflowEventType,
} from "@/lib/backend/workflows";
import { CheckoutPayload, OrderSnapshot } from "@/types";

function createReference(prefix: "QT" | "PMT" | "ORD") {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

export function createQuoteNumber() {
  return createReference("QT");
}

export interface QuoteRecord {
  quoteNumber: string;
  status: QuoteWorkflowStatus;
  customerEmail: string;
  persisted: boolean;
  legacyFallback?: boolean;
}

export interface OrderRecord {
  orderNumber: string;
  workflowStatus: OrderWorkflowStatus;
  paymentStatus: PaymentWorkflowStatus;
  persisted: boolean;
}

export interface WorkflowEventRecord {
  id: string;
  entityType: "quote" | "order" | "upload" | "support";
  entityId: string;
  eventType: WorkflowEventType;
  visibility: "internal" | "customer";
  metadata?: Record<string, unknown>;
}

async function insertWorkflowEvent(event: Omit<WorkflowEventRecord, "id">) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("workflow_events").insert([{
    entity_type: event.entityType,
    entity_id: event.entityId,
    event_type: event.eventType,
    visibility: event.visibility,
    metadata: event.metadata ?? {},
  }] as never[]);

  if (error) {
    logWarn("Workflow event persistence skipped", { eventType: event.eventType, entityType: event.entityType, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function persistQuoteRequest(input: QuoteRequestApiInput, requestMeta: RequestMeta): Promise<QuoteRecord> {
  const quoteNumber = createQuoteNumber();
  const status = getInitialQuoteStatus();
  const supabase = getSupabaseServerClient();

  if (!supabase || !isSupabaseServerConfigured()) {
    return {
      quoteNumber,
      status,
      customerEmail: input.email,
      persisted: false,
    };
  }

  try {
    const { error } = await supabase.from("quote_requests").insert([{
      quote_number: quoteNumber,
      status,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      company_name: input.companyName || null,
      service_needed: input.serviceNeeded,
      quantity_label: input.quantity,
      preferred_deadline: input.preferredDeadline,
      fulfillment_method: input.fulfillmentMethod,
      project_details: input.projectDetails,
      request_ip: requestMeta.ipAddress,
      request_user_agent: requestMeta.userAgent ?? null,
      request_referer: requestMeta.referer ?? null,
    }] as never[]);

    if (error) {
      throw error;
    }

    await insertWorkflowEvent({
      entityType: "quote",
      entityId: quoteNumber,
      eventType: "quote.submitted",
      visibility: "internal",
      metadata: {
        serviceNeeded: input.serviceNeeded,
        fulfillmentMethod: input.fulfillmentMethod,
      },
    });

    return {
      quoteNumber,
      status,
      customerEmail: input.email,
      persisted: true,
    };
  } catch (error) {
    logWarn("Primary quote_requests insert failed, attempting legacy fallback", {
      quoteNumber,
      reason: error instanceof Error ? error.message : String(error),
    });

    const { error: legacyError } = await supabase.from("print_quote_requests").insert([{
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      company_name: input.companyName || null,
      service_needed: input.serviceNeeded,
      quantity: input.quantity,
      preferred_deadline: input.preferredDeadline,
      fulfillment_method: input.fulfillmentMethod,
      project_details: input.projectDetails,
    }] as never[]);

    if (legacyError) {
      logError("Legacy quote request insert failed", legacyError, { quoteNumber });
      return {
        quoteNumber,
        status,
        customerEmail: input.email,
        persisted: false,
      };
    }

    return {
      quoteNumber,
      status,
      customerEmail: input.email,
      persisted: true,
      legacyFallback: true,
    };
  }
}

export async function persistOrderDraft(input: {
  payload: CheckoutPayload;
  order: OrderSnapshot;
  paymentMode: "full" | "deposit";
  stripeSessionId?: string;
  requestMeta: RequestMeta;
}): Promise<OrderRecord> {
  const supabase = getSupabaseServerClient();
  const workflowStatus = getInitialOrderStatus(input.order.quoteReviewRequired);
  const paymentStatus = getInitialPaymentStatus(input.paymentMode, !env.stripeSecretKey);

  if (!supabase || !isSupabaseServerConfigured()) {
    return {
      orderNumber: input.order.orderNumber,
      workflowStatus,
      paymentStatus,
      persisted: false,
    };
  }

  try {
    const { error: orderError } = await supabase.from("orders").insert([{
      order_number: input.order.orderNumber,
      workflow_status: workflowStatus,
      payment_status: paymentStatus,
      payment_mode: input.paymentMode,
      stripe_checkout_session_id: input.stripeSessionId ?? null,
      customer_full_name: input.payload.customer.fullName,
      customer_email: input.payload.customer.email,
      customer_phone: input.payload.customer.phone,
      company_name: input.payload.customer.companyName || null,
      fulfillment_method: input.payload.fulfillmentMethod,
      delivery_address: input.payload.deliveryAddress ?? null,
      order_notes: input.payload.orderNotes ?? null,
      subtotal_cents: input.order.subtotalCents,
      payable_cents: input.order.payableCents,
      quote_review_required: input.order.quoteReviewRequired,
      request_ip: input.requestMeta.ipAddress,
      request_user_agent: input.requestMeta.userAgent ?? null,
      request_referer: input.requestMeta.referer ?? null,
      snapshot: input.order,
    }] as never[]);

    if (orderError) throw orderError;

    const lineItems = input.order.items.map((item) => ({
      order_number: input.order.orderNumber,
      product_slug: item.productSlug,
      title: item.title,
      quantity: item.quantity,
      unit_price_cents: Math.round(item.unitPrice * 100),
      estimated_total_cents: Math.round(item.estimatedTotal * 100),
      pricing_mode: item.pricingMode,
      mode: item.mode,
      options: item.options,
      option_labels: item.optionLabels,
      notes: item.notes ?? null,
      fulfillment_method: item.fulfillmentMethod ?? null,
      turnaround: item.turnaround ?? null,
      quote_only: item.quoteOnly ?? false,
    }));

    if (lineItems.length > 0) {
      const { error: itemsError } = await supabase.from("order_line_items").insert(lineItems as never[]);
      if (itemsError) {
        logWarn("Order line item persistence skipped", { orderNumber: input.order.orderNumber, reason: itemsError.message });
      }
    }

    await insertWorkflowEvent({
      entityType: "order",
      entityId: input.order.orderNumber,
      eventType: "order.created",
      visibility: "internal",
      metadata: {
        itemCount: input.order.items.length,
        quoteReviewRequired: input.order.quoteReviewRequired,
      },
    });

    await insertWorkflowEvent({
      entityType: "order",
      entityId: input.order.orderNumber,
      eventType: "order.payment_pending",
      visibility: "customer",
      metadata: {
        paymentMode: input.paymentMode,
      },
    });

    return {
      orderNumber: input.order.orderNumber,
      workflowStatus,
      paymentStatus,
      persisted: true,
    };
  } catch (error) {
    logError("Order draft persistence failed", error, { orderNumber: input.order.orderNumber });
    return {
      orderNumber: input.order.orderNumber,
      workflowStatus,
      paymentStatus,
      persisted: false,
    };
  }
}

export async function persistArtworkMetadataRecord(metadata: {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  bucket: string;
  path: string | null;
  status: string;
  scope: string;
  quoteId?: string;
  orderId?: string;
  customerId?: string;
  productSlug?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("artwork_uploads").insert([{
    file_id: metadata.fileId,
    file_name: metadata.fileName,
    file_size_bytes: metadata.fileSize,
    mime_type: metadata.mimeType,
    storage_bucket: metadata.bucket,
    storage_path: metadata.path,
    status: metadata.status,
    scope: metadata.scope,
    quote_number: metadata.quoteId ?? null,
    order_number: metadata.orderId ?? null,
    customer_id: metadata.customerId ?? null,
    product_slug: metadata.productSlug ?? null,
  }] as never[]);

  if (error) {
    logWarn("Artwork metadata persistence skipped", { fileName: metadata.fileName, reason: error.message });
    return { persisted: false };
  }

  await insertWorkflowEvent({
    entityType: "upload",
    entityId: metadata.fileId,
    eventType: "upload.received",
    visibility: "internal",
    metadata: {
      fileName: metadata.fileName,
      scope: metadata.scope,
    },
  });

  return { persisted: true };
}

export async function updateOrderPaymentState(params: {
  orderNumber: string;
  paymentStatus: PaymentWorkflowStatus;
  workflowStatus?: OrderWorkflowStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  eventType: WorkflowEventType;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) {
    return { persisted: false };
  }

  const payload: Record<string, unknown> = {
    payment_status: params.paymentStatus,
  };

  if (params.workflowStatus) payload.workflow_status = params.workflowStatus;
  if (params.stripeSessionId) payload.stripe_checkout_session_id = params.stripeSessionId;
  if (params.stripePaymentIntentId) payload.stripe_payment_intent_id = params.stripePaymentIntentId;

  const { error } = await supabase.from("orders").update(payload as never).eq("order_number", params.orderNumber);

  if (error) {
    logWarn("Order payment state update skipped", { orderNumber: params.orderNumber, reason: error.message });
    return { persisted: false };
  }

  await insertWorkflowEvent({
    entityType: "order",
    entityId: params.orderNumber,
    eventType: params.eventType,
    visibility: "customer",
    metadata: {
      paymentStatus: params.paymentStatus,
      workflowStatus: params.workflowStatus,
    },
  });

  return { persisted: true };
}

export async function createPaymentAuditRecord(params: {
  orderNumber: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: PaymentWorkflowStatus;
  amountCents?: number;
  currency?: string;
  rawEventType?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("payment_events").insert([{
    order_number: params.orderNumber,
    stripe_checkout_session_id: params.stripeSessionId ?? null,
    stripe_payment_intent_id: params.stripePaymentIntentId ?? null,
    status: params.status,
    amount_cents: params.amountCents ?? null,
    currency: params.currency ?? "cad",
    raw_event_type: params.rawEventType ?? null,
  }] as never[]);

  if (error) {
    logWarn("Payment audit persistence skipped", { orderNumber: params.orderNumber, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function recordOperationalWarning(message: string, context?: Record<string, unknown>) {
  logInfo("Operational warning", { message, ...context });
}
