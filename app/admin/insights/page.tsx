import { AdminAlertCenter } from "@/components/admin/admin-alert-center";
import { AdminInsightsPanel } from "@/components/admin/admin-insights-panel";
import { AdminKpiGrid } from "@/components/admin/admin-kpi-grid";
import { AdminNotificationCenter } from "@/components/admin/admin-notification-center";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminCommandCenterSnapshot } from "@/lib/backend/command-center";

export default async function AdminInsightsPage() {
  const snapshot = await getAdminCommandCenterSnapshot("30d");

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reporting and intelligence"
        description="A deeper view into conversion, operations, customer behavior, product mix, and notification reliability across the PrintMe platform."
        actionLabel="Back to Command Center"
        actionHref="/admin"
      />

      <AdminKpiGrid items={snapshot.kpis.slice(0, 8)} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminInsightsPanel
          title="Sales funnel reporting"
          description="Measure quote generation, order capture, checkout health, and business momentum over time."
          items={snapshot.salesInsights}
        />
        <AdminInsightsPanel
          title="Workflow reporting"
          description="Follow the pressure points inside quotes, uploads, production, dispatch, and support."
          items={snapshot.operationsInsights}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminInsightsPanel
          title="Customer and retention view"
          description="Use account and order history patterns to identify repeat business opportunities and recovery risk."
          items={snapshot.customerInsights}
        />
        <AdminInsightsPanel
          title="Catalog performance view"
          description="See which services win, which hybrid products create confusion, and where merchandising should get smarter."
          items={snapshot.productInsights}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminAlertCenter
          title="Operational exception watch"
          description="The command center should not just show history. It should point staff to the next problem worth solving."
          items={snapshot.alerts}
        />
        <AdminNotificationCenter
          title="Notification and automation health"
          description="Track the customer and staff messages your workflows are generating so the business can trust its automations."
          items={snapshot.notifications}
        />
      </div>
    </div>
  );
}
