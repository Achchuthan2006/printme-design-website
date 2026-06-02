import {
  adminCustomers,
  adminIntakeTickets,
  adminOrders,
  adminProductionQueue,
  adminQuotes,
  adminUploads,
} from "@/data/admin";

export async function getAdminOperationsWorkspace() {
  const source: "seed" | "live" = "seed";

  return {
    source,
    sourceLabel: "Seeded preview data",
    orders: adminOrders,
    quotes: adminQuotes,
    uploads: adminUploads,
    metrics: [
      { label: "Orders", value: String(adminOrders.length), detail: "Structured order tickets." },
      { label: "Quotes", value: String(adminQuotes.length), detail: "Quote tickets in active review." },
      { label: "Uploads", value: String(adminUploads.length), detail: "Artwork files linked to jobs." },
      { label: "Customers", value: String(adminCustomers.length), detail: "Customer records represented in the workflow." },
      { label: "Intake", value: String(adminIntakeTickets.length), detail: "Cross-channel intake items." },
      { label: "Production", value: String(adminProductionQueue.length), detail: "Jobs currently staged for production or dispatch." },
    ],
    alerts: adminIntakeTickets
      .filter((ticket) => ticket.blockers.length > 0)
      .slice(0, 4)
      .map((ticket) => ({
        id: ticket.id,
        title: ticket.reference,
        detail: ticket.summary,
        severity: ticket.priority === "urgent" || ticket.priority === "high" ? "critical" : "warning",
        href: ticket.href,
      })),
    topProductCategories: Object.entries(
      adminOrders.reduce<Record<string, number>>((summary, order) => {
        summary[order.service] = (summary[order.service] ?? 0) + 1;
        return summary;
      }, {}),
    ).map(([label, count]) => ({ label, count })).slice(0, 5),
    productionQueue: adminProductionQueue,
    roleQueues: [
      {
        id: "intake",
        title: "Intake queue",
        emphasis: "New jobs and missing details",
        count: adminIntakeTickets.length,
        href: "/admin/intake",
        items: adminIntakeTickets.slice(0, 3).map((ticket) => ({
          reference: ticket.reference,
          status: ticket.priority === "urgent" ? "urgent" : ticket.status,
        })),
      },
      {
        id: "production",
        title: "Production queue",
        emphasis: "Ready-for-print and dispatch work",
        count: adminProductionQueue.length,
        href: "/admin/production",
        items: adminProductionQueue.slice(0, 3).map((job) => ({
          reference: job.reference,
          status: job.priority === "urgent" ? "urgent" : "in_production",
        })),
      },
    ],
  };
}
