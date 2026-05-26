import { resolveAppRole } from "@/lib/authz";
import { dispatchWelcomeNotification } from "@/lib/backend/notifications";
import { getProfileByEmail } from "@/lib/backend/repository";
import { isSupabaseServerConfigured } from "@/lib/env";
import { logWarn } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase";
import {
  AccountActivityItem,
  AccountDashboardData,
  AccountFile,
  AccountInvoice,
  AccountOrder,
  AccountQuote,
  AccountReorderTemplate,
  CustomerAddress,
  CustomerProfile,
} from "@/types";
import { buildProfileDraftFromUser } from "@/lib/backend/auth";
import { User } from "@supabase/supabase-js";

function formatCurrency(cents?: number | null) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(((cents ?? 0) || 0) / 100);
}

function formatDate(value?: string | null) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function mapOrderStatus(status?: string | null): AccountOrder["status"] {
  switch (status) {
    case "in_production":
      return "in_production";
    case "ready_for_pickup":
      return "ready_for_pickup";
    case "completed":
    case "delivered":
      return "completed";
    case "quote_review_required":
      return "quote_required";
    default:
      return "pending_review";
  }
}

function mapQuoteStatus(status?: string | null): AccountQuote["status"] {
  switch (status) {
    case "under_review":
    case "waiting_for_files":
      return "reviewing";
    case "quoted":
      return "priced";
    case "approved":
      return "approved";
    case "closed":
      return "expired";
    default:
      return "new";
  }
}

function mapInvoiceStatus(status?: string | null): AccountInvoice["status"] {
  if (status === "paid") return "paid";
  if (status === "void") return "void";
  return "unpaid";
}

function mapUploadStatus(status?: string | null): AccountFile["status"] {
  switch (status) {
    case "awaiting_review":
    case "needs_changes":
    case "approved_for_print":
    case "proof_required":
    case "ready_for_production":
      return status;
    default:
      return "uploaded";
  }
}

async function queryTable(table: string, select: string, matchers: Array<{ column: string; value: string }>) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return [];

  let query = supabase.from(table).select(select);
  const validMatchers = matchers.filter((matcher) => matcher.value);

  if (validMatchers.length === 1) {
    query = query.eq(validMatchers[0].column, validMatchers[0].value);
  } else if (validMatchers.length > 1) {
    const clauses = validMatchers.map((matcher) => `${matcher.column}.eq.${matcher.value}`).join(",");
    query = query.or(clauses);
  }

  const { data, error } = await query;
  if (error) {
    logWarn("Account query skipped", { table, reason: error.message });
    return [];
  }

  return (data ?? []) as Record<string, unknown>[];
}

export async function syncCustomerProfile(user: User, overrides?: Partial<CustomerProfile>) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured() || !user.email) {
    return buildProfileDraftFromUser(user, resolveAppRole(user.email));
  }

  const baseProfile = buildProfileDraftFromUser(user, resolveAppRole(user.email));
  const profile = { ...baseProfile, ...overrides };
  const existingProfile = await getProfileByEmail(user.email);

  const payload = {
    auth_user_id: user.id,
    role: profile.role ?? "customer",
    full_name: profile.fullName,
    email: profile.email,
    phone: profile.phone ?? null,
    company_name: profile.companyName ?? null,
    account_status: profile.accountStatus ?? "active",
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert([payload] as never[], { onConflict: "email" })
    .select("id, auth_user_id, role, full_name, email, phone, company_name, account_status")
    .maybeSingle();

  if (error) {
    logWarn("Profile sync skipped", { userId: user.id, reason: error.message });
    return profile;
  }

  const record = data as {
    id?: string;
    auth_user_id?: string;
    role?: string;
    full_name?: string;
    email?: string;
    phone?: string | null;
    company_name?: string | null;
    account_status?: "active" | "pending" | "paused";
  } | null;

  const resolvedProfile = {
    id: record?.id,
    authUserId: record?.auth_user_id ?? user.id,
    fullName: record?.full_name ?? profile.fullName,
    email: record?.email ?? profile.email,
    phone: record?.phone ?? profile.phone,
    companyName: record?.company_name ?? profile.companyName,
    role: record?.role === "admin" ? "admin" : "customer",
    accountStatus: record?.account_status ?? "active",
    communicationPreferences: profile.communicationPreferences,
  } satisfies CustomerProfile;

  if (!existingProfile && record?.id && record?.email) {
    await dispatchWelcomeNotification({
      profileId: record.id,
      customerEmail: record.email,
      customerFullName: record.full_name ?? profile.fullName,
    });
  }

  return resolvedProfile;
}

export async function getCustomerDashboardData(user: User): Promise<AccountDashboardData> {
  const profile = await syncCustomerProfile(user);
  const profileId = profile.id ?? "";
  const email = user.email ?? profile.email;

  const [addressesRaw, ordersRaw, quotesRaw, filesRaw, invoicesRaw, activityRaw] = await Promise.all([
    queryTable("customer_addresses", "id, label, address_line_1, address_line_2, city, province, postal_code, is_default", [
      { column: "profile_id", value: profileId },
    ]),
    queryTable("orders", "order_number, workflow_status, fulfillment_method, subtotal_cents, payable_cents, created_at", [
      { column: "profile_id", value: profileId },
      { column: "customer_email", value: email },
    ]),
    queryTable("quote_requests", "quote_number, status, service_needed, created_at, project_details", [
      { column: "profile_id", value: profileId },
      { column: "email", value: email },
    ]),
    queryTable("artwork_uploads", "file_id, file_name, status, quote_number, order_number, product_slug, created_at, file_size_bytes, mime_type", [
      { column: "profile_id", value: profileId },
    ]),
    queryTable("invoices", "invoice_number, order_number, total_cents, payment_status, issued_at, due_at", [
      { column: "profile_id", value: profileId },
    ]),
    queryTable("workflow_events", "entity_type, entity_id, event_type, visibility, created_at, metadata", [
      { column: "entity_id", value: profileId },
    ]),
  ]);

  const addresses = addressesRaw.map((record, index) => ({
    id: String(record.id ?? `addr-${index}`),
    label: String(record.label ?? "Saved address"),
    recipient: profile.fullName,
    companyName: profile.companyName,
    addressLine1: String(record.address_line_1 ?? ""),
    addressLine2: typeof record.address_line_2 === "string" ? record.address_line_2 : undefined,
    city: String(record.city ?? "Toronto"),
    province: String(record.province ?? "ON"),
    postalCode: String(record.postal_code ?? ""),
    isDefaultDelivery: Boolean(record.is_default),
  })) satisfies CustomerAddress[];

  const orders = ordersRaw.map((record, index) => ({
    id: String(record.order_number ?? `ord-${index}`),
    orderNumber: String(record.order_number ?? `PM-${index}`),
    date: formatDate(record.created_at as string | null | undefined),
    status: mapOrderStatus(record.workflow_status as string | null | undefined),
    total: formatCurrency(Number(record.payable_cents ?? record.subtotal_cents ?? 0)),
    fulfillmentMethod: String(record.fulfillment_method ?? "pickup"),
    items: [],
    nextStep: `Current backend status: ${String(record.workflow_status ?? "pending review").replaceAll("_", " ")}.`,
    reorderHref: `/quote-request?service=reorder&source=${encodeURIComponent(String(record.order_number ?? ""))}`,
  })) satisfies AccountOrder[];

  const quotes = quotesRaw.map((record, index) => ({
    id: String(record.quote_number ?? `quote-${index}`),
    service: String(record.service_needed ?? "Custom print request"),
    requestedDate: formatDate(record.created_at as string | null | undefined),
    status: mapQuoteStatus(record.status as string | null | undefined),
    summary: String(record.project_details ?? "Quote details received."),
    nextStep: `Current backend status: ${String(record.status ?? "submitted").replaceAll("_", " ")}.`,
  })) satisfies AccountQuote[];

  const files = filesRaw.map((record, index) => ({
    id: String(record.file_id ?? `file-${index}`),
    fileName: String(record.file_name ?? "Artwork file"),
    relatedTo: String(record.order_number ?? record.quote_number ?? record.product_slug ?? "Account library"),
    uploadedAt: formatDate(record.created_at as string | null | undefined),
    fileSize: `${Math.max(1, Math.round(Number(record.file_size_bytes ?? 0) / 1024 / 1024))} MB`,
    fileType: String(record.mime_type ?? "file"),
    status: mapUploadStatus(record.status as string | null | undefined),
    relatedType: record.order_number ? "order" : record.quote_number ? "quote" : "library",
    reusable: true,
  })) satisfies AccountFile[];

  const invoices = invoicesRaw.map((record, index) => ({
    id: String(record.invoice_number ?? `inv-${index}`),
    invoiceNumber: String(record.invoice_number ?? `INV-${index}`),
    orderNumber: String(record.order_number ?? "Pending order"),
    date: formatDate(record.issued_at as string | null | undefined),
    amount: formatCurrency(Number(record.total_cents ?? 0)),
    status: mapInvoiceStatus(record.payment_status as string | null | undefined),
    dueLabel: record.due_at ? `Due ${formatDate(record.due_at as string)}` : undefined,
  })) satisfies AccountInvoice[];

  const activity: AccountActivityItem[] = activityRaw.slice(0, 6).map((record, index) => ({
    id: `activity-${index}`,
    title: String(record.event_type ?? "Account event").replaceAll(".", " "),
    detail: String((record.metadata as { note?: string } | null)?.note ?? "A backend workflow event was recorded."),
    date: formatDate(record.created_at as string | null | undefined),
    entityType: "support",
    href: "/account",
  }));

  const reorders: AccountReorderTemplate[] = orders.slice(0, 3).map((order, index) => ({
    id: `reorder-${index}`,
    title: order.items[0] ?? order.orderNumber,
    sourceType: "order",
    sourceId: order.id,
    summary: "Reuse this job as the starting point for a faster repeat order.",
    lastUsed: order.date,
    recommendedPath: "quote",
    href: order.reorderHref ?? "/quote-request",
    tags: ["Repeat-ready", "Saved account history"],
  }));

  const summary = [
    { label: "Active jobs", value: String(orders.filter((order) => order.status !== "completed").length), detail: "Orders currently moving through review, payment, or production." },
    { label: "Open quotes", value: String(quotes.length), detail: "Quotes that can be reviewed, updated, or converted into orders." },
    { label: "Saved files", value: String(files.length), detail: "Artwork linked to your account, quotes, or orders." },
    { label: "Invoices", value: String(invoices.length), detail: "Billing records attached to recent work." },
  ];

  return {
    profile,
    addresses,
    orders,
    quotes,
    files,
    invoices,
    activity,
    reorders,
    summary,
  };
}
