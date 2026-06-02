import { buildFallbackAdminCommandCenterSnapshot } from "@/data/admin-intelligence";
import { AdminCommandCenterSnapshot, AdminNotificationIntelligenceItem, AdminOperationalAlert, ReportingWindow } from "@/types";
import { isSupabaseServerConfigured } from "@/lib/env";
import { logWarn } from "@/lib/logger";
import { getSupabaseServerClient } from "@/lib/supabase";

function getWindowStart(window: ReportingWindow) {
  const now = new Date();
  const start = new Date(now);
  if (window === "today") {
    start.setHours(0, 0, 0, 0);
    return start;
  }

  const days = Number(window.replace("d", ""));
  start.setDate(start.getDate() - days);
  return start;
}

function getPriorWindowStart(window: ReportingWindow) {
  const currentStart = getWindowStart(window);
  const priorStart = new Date(currentStart);
  if (window === "today") {
    priorStart.setDate(priorStart.getDate() - 1);
    return priorStart;
  }

  const days = Number(window.replace("d", ""));
  priorStart.setDate(priorStart.getDate() - days);
  return priorStart;
}

function inWindow(value: string | null | undefined, start: Date, end: Date) {
  if (!value) return false;
  const date = new Date(value);
  return date >= start && date < end;
}

function parseCurrencyCents(value?: number | null) {
  return Number(value ?? 0) / 100;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.round(value))}%`;
}

function formatDelta(current: number, prior: number, suffix = "") {
  if (!prior && !current) return `0${suffix}`;
  if (!prior) return `+100${suffix}`;
  const delta = ((current - prior) / prior) * 100;
  const rounded = Math.round(delta);
  return `${rounded >= 0 ? "+" : ""}${rounded}${suffix}`;
}

function mapNotificationStatus(status?: string | null): AdminNotificationIntelligenceItem["status"] {
  switch (status) {
    case "sent":
      return "sent";
    case "failed":
      return "failed";
    case "pending":
      return "queued";
    default:
      return "read";
  }
}

function mapActivityEntityType(value: string | null | undefined) {
  switch (value) {
    case "order":
    case "quote":
    case "upload":
    case "customer":
    case "invoice":
    case "product":
      return value;
    default:
      return "order";
  }
}

function buildAlertSeverity(count: number): AdminOperationalAlert["severity"] {
  if (count >= 3) return "critical";
  if (count >= 1) return "warning";
  return "positive";
}

async function queryRows(table: string, select: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return [];

  const { data, error } = await supabase.from(table).select(select);
  if (error) {
    logWarn("Command center query skipped", { table, reason: error.message });
    return [];
  }

  return (data ?? []) as Record<string, unknown>[];
}

export async function getAdminCommandCenterSnapshot(window: ReportingWindow = "30d"): Promise<AdminCommandCenterSnapshot> {
  if (!isSupabaseServerConfigured()) {
    return buildFallbackAdminCommandCenterSnapshot(window);
  }

  const [orders, quotes, uploads, notifications, workflowEvents, supportRequests, analyticsEvents] = await Promise.all([
    queryRows("orders", "order_number, workflow_status, payment_status, fulfillment_method, subtotal_cents, payable_cents, created_at, quote_review_required, customer_email"),
    queryRows("quote_requests", "quote_number, status, service_needed, created_at"),
    queryRows("artwork_uploads", "file_id, status, quote_number, order_number, created_at"),
    queryRows("notifications", "id, entity_type, entity_id, trigger_name, provider, delivery_status, created_at"),
    queryRows("workflow_events", "id, entity_type, entity_id, event_type, created_at, visibility, metadata"),
    queryRows("support_requests", "ticket_number, subject, status, priority, created_at"),
    queryRows("analytics_events", "event_name, session_id, visitor_id, page_type, funnel_name, funnel_stage, event_value, occurred_at, properties"),
  ]);

  if (!orders.length && !quotes.length && !uploads.length && !notifications.length && !workflowEvents.length && !analyticsEvents.length) {
    return buildFallbackAdminCommandCenterSnapshot(window);
  }

  const end = new Date();
  const start = getWindowStart(window);
  const priorStart = getPriorWindowStart(window);
  const currentOrders = orders.filter((row) => inWindow(row.created_at as string | undefined, start, end));
  const priorOrders = orders.filter((row) => inWindow(row.created_at as string | undefined, priorStart, start));
  const currentQuotes = quotes.filter((row) => inWindow(row.created_at as string | undefined, start, end));
  const priorQuotes = quotes.filter((row) => inWindow(row.created_at as string | undefined, priorStart, start));
  const currentUploads = uploads.filter((row) => inWindow(row.created_at as string | undefined, start, end));
  const currentNotifications = notifications.filter((row) => inWindow(row.created_at as string | undefined, start, end));
  const currentAnalytics = analyticsEvents.filter((row) => inWindow(row.occurred_at as string | undefined, start, end));
  const priorAnalytics = analyticsEvents.filter((row) => inWindow(row.occurred_at as string | undefined, priorStart, start));

  const currentRevenue = currentOrders.reduce(
    (sum, row) => sum + parseCurrencyCents((row.payable_cents as number | undefined) ?? (row.subtotal_cents as number | undefined)),
    0,
  );
  const priorRevenue = priorOrders.reduce(
    (sum, row) => sum + parseCurrencyCents((row.payable_cents as number | undefined) ?? (row.subtotal_cents as number | undefined)),
    0,
  );
  const paidOrders = currentOrders.filter((row) => row.payment_status === "paid").length;
  const pickupOrders = currentOrders.filter((row) => row.fulfillment_method === "pickup").length;
  const deliveryOrders = currentOrders.filter((row) => row.fulfillment_method === "delivery").length;
  const activeProduction = currentOrders.filter((row) => row.workflow_status === "in_production").length;
  const readyForPickup = currentOrders.filter((row) => row.workflow_status === "ready_for_pickup").length;
  const artworkQueue = currentUploads.filter((row) => ["uploaded", "awaiting_review", "proof_required"].includes(String(row.status ?? ""))).length;
  const quoteConversion = currentQuotes.length ? (currentOrders.length / currentQuotes.length) * 100 : 0;
  const paymentCompletion = currentOrders.length ? (paidOrders / currentOrders.length) * 100 : 0;
  const staleQuotes = currentQuotes.filter((row) => ["submitted", "under_review", "waiting_for_files"].includes(String(row.status ?? ""))).length;
  const failedNotifications = currentNotifications.filter((row) => row.delivery_status === "failed").length;
  const openSupport = supportRequests.filter((row) => row.status !== "resolved").length;
  const currentSessions = new Set(currentAnalytics.map((row) => String(row.session_id ?? "")).filter(Boolean)).size;
  const priorSessions = new Set(priorAnalytics.map((row) => String(row.session_id ?? "")).filter(Boolean)).size;
  const productViews = currentAnalytics.filter((row) => row.event_name === "product_viewed").length;
  const checkoutStarts = currentAnalytics.filter((row) => row.event_name === "checkout_started").length;
  const proofApprovals = currentAnalytics.filter((row) => row.event_name === "proof_approved").length;
  const mobileSessions = new Set(
    currentAnalytics
      .filter((row) => String((row.properties as Record<string, unknown> | null)?.deviceType ?? "") === "mobile")
      .map((row) => String(row.session_id ?? "")),
  ).size;

  return {
    window,
    windowLabel: window === "today" ? "Today" : `Last ${window.replace("d", "")} days`,
    comparisonLabel: "Compared with the prior matching period",
    kpis: [
      {
        label: "Tracked sessions",
        value: String(currentSessions),
        detail: "First-party sessions captured across storefront, quote, checkout, and proof flows.",
        delta: `${formatDelta(currentSessions, priorSessions, "%")} vs prior`,
        direction: currentSessions >= priorSessions ? "up" : "down",
        href: "/admin/insights",
      },
      {
        label: "Total revenue",
        value: formatCurrency(currentRevenue),
        detail: "Current paid or payable value captured across tracked orders.",
        delta: `${formatDelta(currentRevenue, priorRevenue, "%")} vs prior`,
        direction: currentRevenue >= priorRevenue ? "up" : "down",
        tone: currentRevenue >= priorRevenue ? "positive" : "attention",
        href: "/admin/invoices",
      },
      {
        label: "Order volume",
        value: String(currentOrders.length),
        detail: "Orders created in the selected reporting window.",
        delta: `${formatDelta(currentOrders.length, priorOrders.length, "%")} vs prior`,
        direction: currentOrders.length >= priorOrders.length ? "up" : "down",
        href: "/admin/orders",
      },
      {
        label: "Quote volume",
        value: String(currentQuotes.length),
        detail: "Quote requests entered during the active reporting window.",
        delta: `${formatDelta(currentQuotes.length, priorQuotes.length, "%")} vs prior`,
        direction: currentQuotes.length >= priorQuotes.length ? "up" : "down",
        href: "/admin/quotes",
      },
      {
        label: "Quote-to-order rate",
        value: formatPercent(quoteConversion),
        detail: "Observed order creation rate relative to quote volume in the same period.",
        delta: "Live workflow sample",
        direction: "flat",
        tone: quoteConversion >= 40 ? "positive" : "attention",
        href: "/admin/insights",
      },
      {
        label: "Average order value",
        value: formatCurrency(currentRevenue / Math.max(currentOrders.length, 1)),
        detail: "Average payable value per tracked order in the selected window.",
        delta: "Live workflow sample",
        direction: "flat",
        href: "/admin/insights",
      },
      {
        label: "Payment completion",
        value: formatPercent(paymentCompletion),
        detail: "Share of orders fully confirmed by backend payment state.",
        delta: "Webhook-backed",
        direction: "flat",
        tone: paymentCompletion >= 70 ? "positive" : "attention",
        href: "/admin/invoices",
      },
      {
        label: "Pickup vs delivery",
        value: `${pickupOrders}:${deliveryOrders}`,
        detail: "Fulfillment mix for staffing pickup handoff and dispatch.",
        delta: "Live order mix",
        direction: "flat",
        href: "/admin/orders",
      },
      {
        label: "Active production",
        value: String(activeProduction),
        detail: "Orders currently inside the production queue.",
        delta: "Live operations load",
        direction: "flat",
        href: "/admin/orders",
      },
      {
        label: "Ready for pickup",
        value: String(readyForPickup),
        detail: "Orders waiting on customer handoff or ready notification.",
        delta: "Needs front-desk follow-up",
        direction: "flat",
        href: "/admin/orders",
      },
      {
        label: "Artwork queue",
        value: String(artworkQueue),
        detail: "Uploads still blocking quote or order progress.",
        delta: "Review workload",
        direction: "flat",
        tone: artworkQueue > 0 ? "attention" : "positive",
        href: "/admin/uploads",
      },
      {
        label: "Urgent issues",
        value: String(staleQuotes + failedNotifications + openSupport),
        detail: "Open friction signals across quotes, notifications, and support.",
        delta: "Actionable alerts",
        direction: "flat",
        tone: staleQuotes + failedNotifications + openSupport > 0 ? "attention" : "positive",
        href: "/admin/messages",
      },
    ],
    salesInsights: [
      {
        label: "Quote submission rate",
        value: String(currentQuotes.length),
        detail: `${currentQuotes.length} quote submissions from ${Math.max(currentSessions, 1)} tracked sessions.`,
        change: `${formatDelta(currentQuotes.length, priorQuotes.length, "%")} vs prior period`,
        href: "/admin/quotes",
      },
      {
        label: "Product detail engagement",
        value: String(productViews),
        detail: "Product detail views tied to the current reporting window.",
        change: "Use with add-to-cart and quote starts to find merchandising gaps",
        href: "/admin/orders",
      },
      {
        label: "Checkout starts",
        value: String(checkoutStarts),
        detail: "Customers who progressed from browsing/cart into the checkout flow.",
        change: "Direct-order path health",
        href: "/admin/insights",
      },
      {
        label: "Payment failures",
        value: String(currentOrders.filter((row) => row.payment_status === "failed").length),
        detail: "Orders blocked by unsuccessful payment confirmation.",
        change: "Webhook-backed status",
        href: "/admin/invoices",
      },
    ],
    operationsInsights: [
      {
        label: "Production backlog",
        value: String(currentOrders.filter((row) => !["completed", "shipped_delivered"].includes(String(row.workflow_status ?? ""))).length),
        detail: "Orders still moving through review, payment, production, or handoff.",
        change: "Live workflow count",
        href: "/admin/orders",
      },
      {
        label: "Artwork review queue",
        value: String(artworkQueue),
        detail: "Files that still need prepress or proof action before production can continue.",
        change: "Live upload queue",
        href: "/admin/uploads",
      },
      {
        label: "Support pressure",
        value: String(openSupport),
        detail: "Support tickets still open and likely to create follow-up load for staff.",
        change: "Use for staffing attention",
        href: "/admin/messages",
      },
      {
        label: "Recent workflow activity",
        value: String(workflowEvents.filter((row) => inWindow(row.created_at as string | undefined, start, end)).length),
        detail: "Timeline events captured for audit, status history, and customer milestones.",
        change: "Backend event trail",
        href: "/admin",
      },
    ],
    customerInsights: [
      {
        label: "Mobile session share",
        value: formatPercent((mobileSessions / Math.max(currentSessions, 1)) * 100),
        detail: "Share of tracked sessions on smaller screens for mobile-friction analysis.",
        change: "Useful when comparing mobile funnel drop-off vs desktop",
        href: "/admin/insights",
      },
      {
        label: "Returning customers",
        value: String(new Set(currentOrders.map((row) => String(row.customer_email ?? ""))).size),
        detail: "Distinct customer accounts or emails active in the current window.",
        change: "Useful for repeat-business tracking",
        href: "/admin/customers",
      },
      {
        label: "Customer-visible milestones",
        value: String(workflowEvents.filter((row) => row.visibility === "customer").length),
        detail: "Events suitable for customer status tracking and notification streams.",
        change: "Portal readiness signal",
        href: "/admin/insights",
      },
    ],
    productInsights: [
      {
        label: "Top requested service",
        value: String(currentQuotes[0]?.service_needed ?? currentOrders[0]?.order_number ?? "Custom print"),
        detail: "The most visible quote or order category in the current period.",
        change: "Use this to tune merchandising and staffing",
        href: "/admin/products",
      },
      {
        label: "Quote-only pressure",
        value: String(currentOrders.filter((row) => row.quote_review_required === true).length),
        detail: "Orders or quotes that still need staff interpretation before checkout can finish cleanly.",
        change: "Catalog clarity signal",
        href: "/admin/products",
      },
      {
        label: "Upload-linked jobs",
        value: String(currentUploads.filter((row) => row.order_number || row.quote_number).length),
        detail: "Product demand that already includes real artwork and is closer to production.",
        change: "Production-readiness mix",
        href: "/admin/uploads",
      },
      {
        label: "Proof approvals",
        value: String(proofApprovals),
        detail: "Tracked proof approvals that removed a key release gate.",
        change: "Use alongside proof views and revision requests to spot stalls",
        href: "/admin/proofs",
      },
    ],
    alerts: [
      {
        id: "live-stale-quotes",
        title: "Quotes are waiting too long for follow-up",
        detail: `${staleQuotes} quotes are still in submitted, under-review, or waiting-for-files states.`,
        severity: buildAlertSeverity(staleQuotes),
        category: "quote",
        ageLabel: "Live command-center alert",
        href: "/admin/quotes",
        actionLabel: "Review quotes",
      },
      {
        id: "live-artwork-queue",
        title: "Artwork review queue needs attention",
        detail: `${artworkQueue} uploads are still holding back pricing or production movement.`,
        severity: buildAlertSeverity(artworkQueue),
        category: "upload",
        ageLabel: "Live command-center alert",
        href: "/admin/uploads",
        actionLabel: "Open uploads",
      },
      {
        id: "live-notification-failures",
        title: "Notification delivery failures need review",
        detail: `${failedNotifications} notification events were recorded as failed in the selected window.`,
        severity: buildAlertSeverity(failedNotifications),
        category: "operations",
        ageLabel: "Live command-center alert",
        href: "/admin/messages",
        actionLabel: "Inspect inbox",
      },
    ],
    notifications: currentNotifications.slice(0, 6).map((row, index) => ({
      id: String(row.id ?? `notification-${index}`),
      title: String(row.trigger_name ?? "Workflow notification").replaceAll(".", " "),
      detail: `${String(row.entity_type ?? "entity")} ${String(row.entity_id ?? "")} / provider ${String(row.provider ?? "system")}`,
      channel: row.provider === "sendgrid" ? "email" : row.trigger_name === "payment.confirmed" ? "payment" : "workflow",
      audience: "both",
      priority: row.delivery_status === "failed" ? "high" : "normal",
      status: mapNotificationStatus(row.delivery_status as string | undefined),
      happenedAt: new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(String(row.created_at ?? new Date().toISOString()))),
      href: "/admin/messages",
    })),
    activity: workflowEvents.slice(0, 6).map((row, index) => ({
      id: String(row.id ?? `evt-${index}`),
      entityType: mapActivityEntityType(row.entity_type as string | undefined),
      entityId: String(row.entity_id ?? `entity-${index}`),
      title: String(row.event_type ?? "Workflow event").replaceAll(".", " "),
      detail: "Live workflow event captured for reporting and customer/status history.",
      actor: row.visibility === "customer" ? "Customer-facing automation" : "Internal workflow",
      occurredAt: new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(String(row.created_at ?? new Date().toISOString()))),
      tone: row.visibility === "customer" ? "success" : "default",
    })),
  };
}
