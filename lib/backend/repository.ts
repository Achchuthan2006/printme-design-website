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

export interface IdempotencyRecord {
  scope: string;
  key: string;
  requestHash: string;
  statusCode: number;
  responseBody: Record<string, unknown>;
}

export interface NotificationRecordInput {
  entityType: "quote" | "order" | "upload" | "support";
  entityId: string;
  triggerName: string;
  provider: "sendgrid" | "system";
  deliveryStatus: "pending" | "sent" | "failed" | "skipped";
  payload?: Record<string, unknown>;
  deliveredAt?: string;
}

export interface PrivateBillingCustomerInput {
  profileId?: string | null;
  email: string;
  stripeCustomerId: string;
  customerName?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface PrivatePaymentRecordInput {
  orderNumber: string;
  profileId?: string | null;
  invoiceId?: string | null;
  providerCustomerId?: string | null;
  providerCheckoutSessionId?: string | null;
  providerPaymentIntentId?: string | null;
  providerChargeId?: string | null;
  paymentMode: "full" | "deposit";
  status: PaymentWorkflowStatus;
  amountAuthorizedCents?: number | null;
  amountCapturedCents?: number | null;
  amountRefundedCents?: number | null;
  currency?: string | null;
  billingEmail?: string | null;
  metadata?: Record<string, unknown>;
}

export interface WebhookEventInput {
  provider: "stripe";
  providerEventId: string;
  eventType: string;
  livemode: boolean;
  relatedOrderNumber?: string | null;
  processingStatus?: "received" | "processed" | "ignored" | "failed";
  payload: Record<string, unknown>;
  processingError?: string | null;
}

export interface AnalyticsEventInput {
  eventName: string;
  entityType?: "quote" | "order" | "upload" | "support" | "customer" | "payment";
  entityId?: string | null;
  profileId?: string | null;
  sessionId?: string | null;
  source?: string;
  path?: string | null;
  funnelStage?: string | null;
  properties?: Record<string, unknown>;
}

export interface NotificationInboxItemInput {
  title: string;
  detail: string;
  audience: "customer" | "staff" | "both";
  channel: "email" | "workflow" | "payment" | "support" | "system";
  priority: "low" | "normal" | "high" | "urgent";
  actionHref?: string | null;
  notificationId?: string | null;
  recipientProfileId?: string | null;
}

export interface OperationalAlertInput {
  entityType?: "quote" | "order" | "upload" | "payment" | "customer" | "operations";
  entityId?: string | null;
  severity: "info" | "warning" | "critical" | "positive";
  category: string;
  title: string;
  detail: string;
  actionHref?: string | null;
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

async function resolveProfileIdByEmail(email?: string | null) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured() || !email) return null;

  const { data, error } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
  if (error) {
    logWarn("Profile lookup skipped", { email, reason: error.message });
    return null;
  }

  const record = data as { id?: string } | null;
  return record?.id ?? null;
}

export async function getProfileByEmail(email?: string | null) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured() || !email) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, auth_user_id, full_name, email, phone, company_name, role")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    logWarn("Profile lookup by email skipped", { email, reason: error.message });
    return null;
  }

  return (data as {
    id: string;
    auth_user_id?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    role?: string | null;
  } | null) ?? null;
}

export async function recordNotificationEvent(input: NotificationRecordInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("notifications").insert([{
    entity_type: input.entityType,
    entity_id: input.entityId,
    trigger_name: input.triggerName,
    provider: input.provider,
    delivery_status: input.deliveryStatus,
    payload: input.payload ?? {},
    delivered_at: input.deliveredAt ?? null,
  }] as never[]);

  if (error) {
    logWarn("Notification event persistence skipped", {
      entityType: input.entityType,
      entityId: input.entityId,
      triggerName: input.triggerName,
      reason: error.message,
    });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("analytics_events").insert([{
    event_name: input.eventName,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    profile_id: input.profileId ?? null,
    session_id: input.sessionId ?? null,
    source: input.source ?? "web",
    path: input.path ?? null,
    funnel_stage: input.funnelStage ?? null,
    properties: input.properties ?? {},
  }] as never[]);

  if (error) {
    logWarn("Analytics event persistence skipped", { eventName: input.eventName, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function recordNotificationInboxItem(input: NotificationInboxItemInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("notification_inbox").insert([{
    notification_id: input.notificationId ?? null,
    recipient_profile_id: input.recipientProfileId ?? null,
    audience: input.audience,
    channel: input.channel,
    priority: input.priority,
    title: input.title,
    detail: input.detail,
    action_href: input.actionHref ?? null,
  }] as never[]);

  if (error) {
    logWarn("Notification inbox persistence skipped", { title: input.title, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function recordOperationalAlert(input: OperationalAlertInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("operational_alerts").insert([{
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    severity: input.severity,
    category: input.category,
    title: input.title,
    detail: input.detail,
    action_href: input.actionHref ?? null,
    metadata: input.metadata ?? {},
  }] as never[]);

  if (error) {
    logWarn("Operational alert persistence skipped", { title: input.title, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function recordEmailDeliveryEvent(input: {
  notificationId?: string | null;
  entityType: "quote" | "order" | "upload" | "support";
  entityId: string;
  triggerName: string;
  recipient: string;
  provider: "sendgrid";
  providerMessageId?: string;
  deliveryStatus: "pending" | "sent" | "failed" | "skipped";
  payload?: Record<string, unknown>;
  sentAt?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("private.email_deliveries").insert([{
    notification_id: input.notificationId ?? null,
    entity_type: input.entityType,
    entity_id: input.entityId,
    trigger_name: input.triggerName,
    recipient: input.recipient,
    provider: input.provider,
    provider_message_id: input.providerMessageId ?? null,
    delivery_status: input.deliveryStatus,
    payload: input.payload ?? {},
    sent_at: input.sentAt ?? null,
  }] as never[]);

  if (error) {
    logWarn("Private email delivery persistence skipped", { entityId: input.entityId, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function getPrivateBillingCustomer(params: { profileId?: string | null; email?: string | null }) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return null;

  let query = supabase.from("private.billing_customers").select(
    "id, profile_id, email, stripe_customer_id, customer_name, phone, metadata, created_at",
  );

  if (params.profileId) {
    query = query.eq("profile_id", params.profileId);
  } else if (params.email) {
    query = query.eq("email", params.email);
  } else {
    return null;
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) {
    logWarn("Private billing customer lookup skipped", { reason: error.message });
    return null;
  }

  return (data as {
    id: string;
    profile_id?: string | null;
    email: string;
    stripe_customer_id: string;
    customer_name?: string | null;
    phone?: string | null;
    metadata?: Record<string, unknown> | null;
  } | null) ?? null;
}

export async function upsertPrivateBillingCustomer(input: PrivateBillingCustomerInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("private.billing_customers").upsert([{
    profile_id: input.profileId ?? null,
    email: input.email,
    stripe_customer_id: input.stripeCustomerId,
    customer_name: input.customerName ?? null,
    phone: input.phone ?? null,
    metadata: input.metadata ?? {},
  }] as never[], {
    onConflict: "stripe_customer_id",
  });

  if (error) {
    logWarn("Private billing customer upsert skipped", { email: input.email, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function upsertPrivatePaymentRecord(input: PrivatePaymentRecordInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const payload = {
    order_number: input.orderNumber,
    invoice_id: input.invoiceId ?? null,
    profile_id: input.profileId ?? null,
    provider: "stripe",
    provider_customer_id: input.providerCustomerId ?? null,
    provider_checkout_session_id: input.providerCheckoutSessionId ?? null,
    provider_payment_intent_id: input.providerPaymentIntentId ?? null,
    provider_charge_id: input.providerChargeId ?? null,
    payment_mode: input.paymentMode,
    status: input.status,
    amount_authorized_cents: input.amountAuthorizedCents ?? null,
    amount_captured_cents: input.amountCapturedCents ?? null,
    amount_refunded_cents: input.amountRefundedCents ?? 0,
    currency: input.currency ?? "cad",
    billing_email: input.billingEmail ?? null,
    metadata: input.metadata ?? {},
  };

  const { error } = await supabase.from("private.payment_records").upsert([payload] as never[], {
    onConflict: "provider_checkout_session_id",
  });

  if (error) {
    logWarn("Private payment record upsert skipped", { orderNumber: input.orderNumber, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function getPrivatePaymentRecordByOrderNumber(orderNumber: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return null;

  const { data, error } = await supabase.from("private.payment_records").select(
    "id, order_number, profile_id, provider_customer_id, provider_checkout_session_id, provider_payment_intent_id, payment_mode, status, amount_authorized_cents, amount_captured_cents, amount_refunded_cents, currency, billing_email, metadata",
  ).eq("order_number", orderNumber).order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (error) {
    logWarn("Private payment record lookup skipped", { orderNumber, reason: error.message });
    return null;
  }

  return data as {
    id: string;
    order_number: string;
    profile_id?: string | null;
    provider_customer_id?: string | null;
    provider_checkout_session_id?: string | null;
    provider_payment_intent_id?: string | null;
    payment_mode: "full" | "deposit";
    status: PaymentWorkflowStatus;
    amount_authorized_cents?: number | null;
    amount_captured_cents?: number | null;
    amount_refunded_cents?: number | null;
    currency?: string | null;
    billing_email?: string | null;
    metadata?: Record<string, unknown> | null;
  } | null;
}

export async function persistWebhookEventRecord(input: WebhookEventInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("private.webhook_events").upsert([{
    provider: input.provider,
    provider_event_id: input.providerEventId,
    event_type: input.eventType,
    livemode: input.livemode,
    related_order_number: input.relatedOrderNumber ?? null,
    processing_status: input.processingStatus ?? "received",
    payload: input.payload,
    processing_error: input.processingError ?? null,
    processed_at: input.processingStatus === "processed" || input.processingStatus === "ignored" ? new Date().toISOString() : null,
  }] as never[], {
    onConflict: "provider_event_id",
  });

  if (error) {
    logWarn("Webhook event persistence skipped", { providerEventId: input.providerEventId, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function findIdempotencyRecord(scope: string, key: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return null;

  const { data, error } = await supabase
    .from("idempotency_keys")
    .select("scope, idempotency_key, request_hash, status_code, response_body")
    .eq("scope", scope)
    .eq("idempotency_key", key)
    .maybeSingle();

  if (error) {
    logWarn("Idempotency lookup skipped", { scope, key, reason: error.message });
    return null;
  }

  if (!data) return null;

  const record = data as {
    scope: string;
    idempotency_key: string;
    request_hash: string;
    status_code: number | null;
    response_body: Record<string, unknown> | null;
  };

  return {
    scope: record.scope,
    key: record.idempotency_key,
    requestHash: record.request_hash,
    statusCode: Number(record.status_code ?? 200),
    responseBody: record.response_body ?? {},
  } satisfies IdempotencyRecord;
}

export async function persistIdempotencyRecord(record: IdempotencyRecord) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const { error } = await supabase.from("idempotency_keys").upsert([{
    scope: record.scope,
    idempotency_key: record.key,
    request_hash: record.requestHash,
    status_code: record.statusCode,
    response_body: record.responseBody,
    completed_at: new Date().toISOString(),
  }] as never[], {
    onConflict: "scope,idempotency_key",
  });

  if (error) {
    logWarn("Idempotency persistence skipped", { scope: record.scope, key: record.key, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
}

export async function persistQuoteRequest(input: QuoteRequestApiInput, requestMeta: RequestMeta): Promise<QuoteRecord> {
  const quoteNumber = createQuoteNumber();
  const status = getInitialQuoteStatus();
  const supabase = getSupabaseServerClient();
  const profileId = await resolveProfileIdByEmail(input.email);

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
      profile_id: profileId,
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
  const profileId = await resolveProfileIdByEmail(input.payload.customer.email);

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
      profile_id: profileId,
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

export async function updateOrderCheckoutSession(params: {
  orderNumber: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return { persisted: false };

  const payload: Record<string, unknown> = {};
  if (params.stripeSessionId) payload.stripe_checkout_session_id = params.stripeSessionId;
  if (params.stripePaymentIntentId) payload.stripe_payment_intent_id = params.stripePaymentIntentId;

  if (Object.keys(payload).length === 0) {
    return { persisted: false };
  }

  const { error } = await supabase.from("orders").update(payload as never).eq("order_number", params.orderNumber);
  if (error) {
    logWarn("Order checkout session update skipped", { orderNumber: params.orderNumber, reason: error.message });
    return { persisted: false };
  }

  return { persisted: true };
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
    profile_id: metadata.customerId ?? null,
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

export async function getOrderNotificationContext(orderNumber: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("order_number, customer_email, customer_full_name, workflow_status, payment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    logWarn("Order notification context lookup skipped", { orderNumber, reason: error.message });
    return null;
  }

  if (!data) return null;

  const record = data as {
    order_number: string;
    customer_email: string;
    customer_full_name: string;
    workflow_status: string;
    payment_status: string;
  };

  return {
    orderNumber: record.order_number,
    customerEmail: record.customer_email,
    customerFullName: record.customer_full_name,
    workflowStatus: record.workflow_status,
    paymentStatus: record.payment_status,
  };
}

export async function getUploadNotificationContext(params: {
  profileId?: string;
  quoteNumber?: string;
  orderNumber?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return null;

  if (params.profileId) {
    const { data } = await supabase.from("profiles").select("email, full_name").eq("id", params.profileId).maybeSingle();
    const profile = data as { email?: string | null; full_name?: string | null } | null;
    if (profile?.email) {
      return {
        customerEmail: profile.email,
        customerFullName: profile.full_name ?? undefined,
      };
    }
  }

  if (params.orderNumber) {
    const order = await getOrderNotificationContext(params.orderNumber);
    if (order?.customerEmail) {
      return {
        customerEmail: order.customerEmail,
        customerFullName: order.customerFullName,
      };
    }
  }

  if (params.quoteNumber) {
    const { data } = await supabase
      .from("quote_requests")
      .select("email, full_name")
      .eq("quote_number", params.quoteNumber)
      .maybeSingle();
    const quote = data as { email?: string | null; full_name?: string | null } | null;
    if (quote?.email) {
      return {
        customerEmail: quote.email,
        customerFullName: quote.full_name ?? undefined,
      };
    }
  }

  return null;
}

export async function getOrderPaymentSnapshot(orderNumber: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("order_number, payment_status, workflow_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    logWarn("Order payment snapshot lookup skipped", { orderNumber, reason: error.message });
    return null;
  }

  if (!data) return null;

  const record = data as {
    order_number: string;
    payment_status: PaymentWorkflowStatus;
    workflow_status: OrderWorkflowStatus;
  };

  return {
    orderNumber: record.order_number,
    paymentStatus: record.payment_status,
    workflowStatus: record.workflow_status,
  };
}

export async function recordOperationalWarning(message: string, context?: Record<string, unknown>) {
  logInfo("Operational warning", { message, ...context });
}
