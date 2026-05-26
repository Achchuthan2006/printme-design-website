import {
  AdminCommandCenterSnapshot,
  AdminInsightRow,
  AdminKpiMetric,
  AdminNotificationIntelligenceItem,
  AdminOperationalAlert,
  ReportingWindow,
} from "@/types";
import {
  adminCustomers,
  adminMessages,
  adminOrders,
  adminQuotes,
  adminUploads,
  adminWorkflowEvents,
} from "@/data/admin";

const reportingWindowLabels: Record<ReportingWindow, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

function parseCurrency(value: string) {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function buildKpis(): AdminKpiMetric[] {
  const totalRevenue = adminOrders.reduce((sum, order) => sum + parseCurrency(order.total), 0);
  const orderVolume = adminOrders.length;
  const quoteVolume = adminQuotes.length;
  const quotedOrApproved = adminQuotes.filter((quote) => ["quoted", "approved", "customer_responded"].includes(quote.status)).length;
  const paidOrders = adminOrders.filter((order) => order.paymentStatus === "paid").length;
  const pickupOrders = adminOrders.filter((order) => order.fulfillmentMethod === "Pickup").length;
  const deliveryOrders = adminOrders.filter((order) => order.fulfillmentMethod === "Delivery").length;
  const activeProduction = adminOrders.filter((order) => order.productionStatus === "in_production").length;
  const readyForPickup = adminOrders.filter((order) => order.productionStatus === "ready_for_pickup").length;
  const artworkQueue = adminUploads.filter((upload) => ["uploaded", "proof_required", "awaiting_review"].includes(upload.status)).length;
  const urgentIssues = adminUploads.filter((upload) => upload.priority === "urgent").length + adminMessages.filter((message) => message.priority === "high" && message.status !== "resolved").length;

  return [
    {
      label: "Total revenue",
      value: formatCurrency(totalRevenue),
      detail: "Paid and deposit-backed order value moving through the current operating period.",
      delta: "+14% vs prior period",
      direction: "up",
      tone: "positive",
      href: "/admin/invoices",
    },
    {
      label: "Order volume",
      value: String(orderVolume),
      detail: "Orders currently persisted across pickup, delivery, and review-required jobs.",
      delta: "+2 jobs",
      direction: "up",
      href: "/admin/orders",
    },
    {
      label: "Quote volume",
      value: String(quoteVolume),
      detail: "New and active quote requests that still influence near-term production demand.",
      delta: "+9% inquiry pace",
      direction: "up",
      href: "/admin/quotes",
    },
    {
      label: "Quote-to-order rate",
      value: formatPercent((quotedOrApproved / Math.max(quoteVolume, 1)) * 100),
      detail: "Share of tracked quotes that have advanced past initial review into pricing or approval.",
      delta: "+6 pts",
      direction: "up",
      tone: "positive",
      href: "/admin/insights",
    },
    {
      label: "Average order value",
      value: formatCurrency(totalRevenue / Math.max(orderVolume, 1)),
      detail: "Average payable value per order, useful for pricing strategy and upsell monitoring.",
      delta: "+$18 vs prior",
      direction: "up",
      href: "/admin/insights",
    },
    {
      label: "Payment completion",
      value: formatPercent((paidOrders / Math.max(orderVolume, 1)) * 100),
      detail: "Orders fully captured, excluding deposits that still need the final balance collected.",
      delta: "-1 pt",
      direction: "down",
      tone: "attention",
      href: "/admin/invoices",
    },
    {
      label: "Pickup vs delivery",
      value: `${pickupOrders}:${deliveryOrders}`,
      detail: "Current fulfillment mix, useful for staffing the front desk and dispatch handoff.",
      delta: "Pickup-led week",
      direction: "flat",
      href: "/admin/orders",
    },
    {
      label: "Active production",
      value: String(activeProduction),
      detail: "Jobs actively running through the press or finishing queue right now.",
      delta: "1 rush job live",
      direction: "flat",
      href: "/admin/orders",
    },
    {
      label: "Ready for pickup",
      value: String(readyForPickup),
      detail: "Orders that need a customer notification, front-desk handoff, or dispatch confirmation.",
      delta: "Call queue ready",
      direction: "flat",
      href: "/admin/orders",
    },
    {
      label: "Artwork queue",
      value: String(artworkQueue),
      detail: "Uploads that still need review, proofing, or readiness checks before production can start.",
      delta: "+1 proof check",
      direction: "up",
      tone: "attention",
      href: "/admin/uploads",
    },
    {
      label: "Urgent issues",
      value: String(urgentIssues),
      detail: "High-priority operational or customer issues that should be surfaced before they become delays.",
      delta: "Needs same-day action",
      direction: "down",
      tone: "attention",
      href: "/admin/messages",
    },
  ];
}

function buildSalesInsights(): AdminInsightRow[] {
  return [
    {
      label: "Homepage to quote intent",
      value: "8.4%",
      detail: "Current tracked quote-start intent compared with service browsing sessions.",
      change: "+1.1 pts vs prior period",
      href: "/admin/insights",
    },
    {
      label: "Checkout completion",
      value: "67%",
      detail: "Share of carts that currently make it through payment without dropping into review-only friction.",
      change: "+5 pts after checkout clarity updates",
      href: "/admin/orders",
    },
    {
      label: "Repeat customer rate",
      value: "66%",
      detail: "Returning-customer share across the current order sample, showing healthy re-order behavior.",
      change: "Northline and EventLine drove the lift",
      href: "/admin/customers",
    },
    {
      label: "Stalled funnel risk",
      value: "2 quotes",
      detail: "Quotes waiting on files or customer approval long enough to threaten conversion.",
      change: "Both need staff follow-up today",
      href: "/admin/quotes",
    },
  ];
}

function buildOperationsInsights(): AdminInsightRow[] {
  return [
    {
      label: "Production backlog",
      value: "3 active jobs",
      detail: "Jobs still moving through review, proof, production, or dispatch.",
      change: "1 is rush-priority",
      href: "/admin/orders",
    },
    {
      label: "Artwork bottleneck",
      value: "2 files",
      detail: "Uploads still blocking a quote or order because review or proof approval is incomplete.",
      change: "1 low-resolution logo needs follow-up",
      href: "/admin/uploads",
    },
    {
      label: "Pickup readiness",
      value: "1 handoff",
      detail: "Completed job waiting on a customer message or delivery coordination before closure.",
      change: "Dispatch note still needed",
      href: "/admin/orders/ord_1046",
    },
    {
      label: "Average turnaround",
      value: "2.8 days",
      detail: "Current pace from quote/order entry to ready-for-handoff state across active jobs.",
      change: "-0.4 days vs prior period",
      href: "/admin/insights",
    },
  ];
}

function buildCustomerInsights(): AdminInsightRow[] {
  return [
    {
      label: "Top customer",
      value: adminCustomers[2]?.company ?? "EventLine",
      detail: `${adminCustomers[2]?.lifetimeValue ?? "$2,350"} lifetime value with large-format and delivery-heavy work.`,
      change: "Strong candidate for proactive reorder outreach",
      href: "/admin/customers/cus_eventline",
    },
    {
      label: "Returning vs new mix",
      value: "2:1",
      detail: "Current pipeline favors repeat business, which is healthy for predictable print operations.",
      change: "Retention is stronger than acquisition right now",
      href: "/admin/customers",
    },
    {
      label: "Recovery-ready accounts",
      value: "4 accounts",
      detail: "Customers who have not ordered recently but still match common repeat-print patterns.",
      change: "Postcard and flyer campaigns are the easiest win-back angle",
      href: "/admin/messages",
    },
  ];
}

function buildProductInsights(): AdminInsightRow[] {
  return [
    {
      label: "Top-selling service",
      value: "Flyers",
      detail: "Flyers are still the strongest direct revenue driver in the current sample.",
      change: "Gloss stock and pickup are the dominant combination",
      href: "/admin/products",
    },
    {
      label: "Top quote category",
      value: "Brochures",
      detail: "Brochure quotes are currently the highest-value inquiry category and deserve fast staff follow-up.",
      change: "Stock advice appears to be the main decision blocker",
      href: "/admin/quotes/quo_3021",
    },
    {
      label: "Frequently reordered",
      value: "Business Cards",
      detail: "Highland-style repeat card jobs are good candidates for saved specs and one-click reorder shortcuts.",
      change: "Portal reorder flow can reduce support load",
      href: "/admin/products",
    },
    {
      label: "Confusion hotspot",
      value: "Postcards",
      detail: "Hybrid postcard flows still create uncertainty around direct order vs quote vs print-and-mail scope.",
      change: "Needs pricing and route clarity",
      href: "/admin/products",
    },
  ];
}

function buildAlerts(): AdminOperationalAlert[] {
  return [
    {
      id: "alert-brochure-quote",
      title: "Brochure quote is nearing the response SLA",
      detail: "Q-3021 still needs a fold-style confirmation and pricing reply before close of day.",
      severity: "critical",
      category: "quote",
      ageLabel: "10 min in attention queue",
      href: "/admin/quotes/quo_3021",
      actionLabel: "Finish quote",
    },
    {
      id: "alert-proof-card",
      title: "Low-resolution artwork is holding a business card order",
      detail: "The Highland logo file needs proof review before PM-1047 can move into production.",
      severity: "warning",
      category: "upload",
      ageLabel: "Awaiting proof sign-off",
      href: "/admin/uploads",
      actionLabel: "Review upload",
    },
    {
      id: "alert-dispatch-banner",
      title: "Completed banner job still needs dispatch confirmation",
      detail: "PM-1046 is finished but the delivery handoff is not closed, which risks a late customer update.",
      severity: "warning",
      category: "order",
      ageLabel: "Ready now",
      href: "/admin/orders/ord_1046",
      actionLabel: "Assign handoff",
    },
    {
      id: "alert-menu-rush",
      title: "Rush menu request needs a same-day answer",
      detail: "A high-priority support message is asking for tomorrow-turnaround menus and could convert quickly.",
      severity: "positive",
      category: "customer",
      ageLabel: "18 min ago",
      href: "/admin/messages",
      actionLabel: "Reply now",
    },
  ];
}

function buildNotifications(): AdminNotificationIntelligenceItem[] {
  const baseNotifications: AdminNotificationIntelligenceItem[] = [
    {
      id: "notif-quote-received",
      title: "New quote submitted for brochures",
      detail: "Customer-facing confirmation went out and the staff review queue now has one high-priority brochure request.",
      channel: "workflow",
      audience: "both",
      priority: "high",
      status: "action_needed",
      happenedAt: "10 min ago",
      href: "/admin/quotes/quo_3021",
    },
    {
      id: "notif-payment-confirmed",
      title: "Payment confirmed for PM-1048",
      detail: "The order is financially clear and already moved into production, so the next update should be operational.",
      channel: "payment",
      audience: "both",
      priority: "normal",
      status: "sent",
      happenedAt: "1 hour ago",
      href: "/admin/orders/ord_1048",
    },
    {
      id: "notif-upload-review",
      title: "Artwork review is still pending for brochure layout upload",
      detail: "The upload arrived successfully, but the job cannot be priced or approved until stock and fold guidance is resolved.",
      channel: "workflow",
      audience: "staff",
      priority: "high",
      status: "queued",
      happenedAt: "Today, 10:02 AM",
      href: "/admin/uploads",
    },
  ];

  const messageNotifications: AdminNotificationIntelligenceItem[] = adminMessages.map((message, index) => ({
    id: `notif-message-${index}`,
    title: message.subject,
    detail: message.summary,
    channel: message.channel === "support" ? "support" : "workflow",
    audience: "staff",
    priority: message.priority,
    status: message.status === "resolved" ? "read" : message.priority === "high" ? "action_needed" : "queued",
    happenedAt: message.receivedAt,
    href: "/admin/messages",
  }));

  return [...baseNotifications, ...messageNotifications].slice(0, 6);
}

export function buildFallbackAdminCommandCenterSnapshot(window: ReportingWindow = "30d"): AdminCommandCenterSnapshot {
  return {
    window,
    windowLabel: reportingWindowLabels[window],
    comparisonLabel: "Compared with the prior matching period",
    kpis: buildKpis(),
    salesInsights: buildSalesInsights(),
    operationsInsights: buildOperationsInsights(),
    customerInsights: buildCustomerInsights(),
    productInsights: buildProductInsights(),
    alerts: buildAlerts(),
    notifications: buildNotifications(),
    activity: adminWorkflowEvents,
  };
}

export const fallbackAdminCommandCenterSnapshot = buildFallbackAdminCommandCenterSnapshot("30d");
