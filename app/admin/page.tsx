import Link from "next/link";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
import { AdminAlertCenter } from "@/components/admin/admin-alert-center";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInsightsPanel } from "@/components/admin/admin-insights-panel";
import { AdminKpiGrid } from "@/components/admin/admin-kpi-grid";
import { AdminNotificationCenter } from "@/components/admin/admin-notification-center";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminCommandCenterSnapshot } from "@/lib/backend/command-center";

export default async function AdminDashboardPage() {
  const snapshot = await getAdminCommandCenterSnapshot("30d");

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Business command center"
        description="Monitor revenue, conversion health, production movement, customer momentum, and workflow risk from one serious PrintMe control surface."
        actionLabel="Open Insights"
        actionHref="/admin/insights"
      />

      <AdminCard className="hero-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Reporting window</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-ink">{snapshot.windowLabel}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">{snapshot.comparisonLabel}. Use this view to decide where sales, prepress, production, and customer follow-up need attention first.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Today", href: "/admin/insights" },
              { label: "30-day detail", href: "/admin/insights" },
              { label: "Notification inbox", href: "/admin/messages" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="rounded-full border border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate transition hover:border-brand/30 hover:text-brand">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminKpiGrid items={snapshot.kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminInsightsPanel
          title="Sales and conversion intelligence"
          description="Track where demand is coming from, where shoppers stall, and which flows are creating the strongest business results."
          items={snapshot.salesInsights}
        />
        <AdminInsightsPanel
          title="Operational reporting"
          description="Stay ahead of production bottlenecks, artwork delays, support pressure, and pickup or dispatch handoffs."
          items={snapshot.operationsInsights}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminAlertCenter
          title="Actionable alerts"
          description="These alerts are meant to move work forward, reduce missed deadlines, and surface issues before customers need to chase the team."
          items={snapshot.alerts}
        />
        <AdminNotificationCenter
          title="Notification intelligence"
          description="See which customer or staff notifications were sent, failed, queued, or still need a human decision behind them."
          items={snapshot.notifications}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminInsightsPanel
          title="Customer insights"
          description="Use customer visibility to support repeat business, recovery campaigns, and smarter service recommendations."
          items={snapshot.customerInsights}
        />
        <AdminInsightsPanel
          title="Product and service performance"
          description="Identify which service families convert, which specs repeat, and where the catalog still creates friction or ambiguity."
          items={snapshot.productInsights}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminActivityTimeline title="Recent business activity" items={snapshot.activity} />
        <AdminCard>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Command-center next moves</h2>
          <div className="mt-5 space-y-4">
            {[
              {
                title: "Review quote pipeline",
                detail: "Triage stale, high-value, or file-blocked quotes before they soften into low-conversion leads.",
                href: "/admin/quotes",
              },
              {
                title: "Clear artwork blockers",
                detail: "Move uploads through proofing faster so the quote and production pipeline stays clean.",
                href: "/admin/uploads",
              },
              {
                title: "Audit notification failures",
                detail: "Fix operational blind spots when payment, upload, or pickup messages do not reach the customer cleanly.",
                href: "/admin/messages",
              },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="block rounded-2xl border border-line bg-canvas px-4 py-4 transition hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-soft/15">
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
