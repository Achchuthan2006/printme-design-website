import Link from "next/link";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
import { AdminAlertCenter } from "@/components/admin/admin-alert-center";
import { AdminAiOpsPanel } from "@/components/admin/admin-ai-ops-panel";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInsightsPanel } from "@/components/admin/admin-insights-panel";
import { AdminKpiGrid } from "@/components/admin/admin-kpi-grid";
import { AdminNotificationCenter } from "@/components/admin/admin-notification-center";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminProductionQueue } from "@/components/admin/admin-production-queue";
import { AdminWorkflowAudit } from "@/components/admin/admin-workflow-audit";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { getAdminOperationsWorkspace } from "@/lib/backend/admin-operations";
import { getAdminCommandCenterSnapshot } from "@/lib/backend/command-center";
import { adminDashboardMetrics, adminWorkflowAudit } from "@/data/admin";

export default async function AdminDashboardPage() {
  const [snapshot, workspace] = await Promise.all([
    getAdminCommandCenterSnapshot("30d"),
    getAdminOperationsWorkspace(),
  ]);

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

      <AdminAiOpsPanel snapshot={snapshot} workspace={workspace} />

      <div className="grid gap-4 md:grid-cols-4">
        {adminDashboardMetrics.map((metric) => (
          <AdminCard key={metric.label}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{metric.label}</p>
            <p className="mt-2 text-4xl font-black text-ink">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{metric.detail}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Operations layer</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-ink">Structured print workflow visibility</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate">
              Source: {workspace.sourceLabel}. The staff side now reads one shared workflow model for intake, proofing, commercial readiness, assignment, production, and fulfillment.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-3">
            {workspace.metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-line bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{metric.label}</p>
                <p className="mt-2 text-3xl font-black text-ink">{metric.value}</p>
                <p className="mt-2 text-xs leading-5 text-slate">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

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

      <AdminCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Internal workflow priorities</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate">
              The next major layer after storefront ordering is a disciplined internal operating system: centralized intake, proof control, readiness gating, structured handoff, and production visibility.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/intake" className="rounded-full border border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate transition hover:border-brand/30 hover:text-brand">
              Intake Board
            </Link>
            <Link href="/admin/production" className="rounded-full border border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate transition hover:border-brand/30 hover:text-brand">
              Production Queue
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <AdminWorkflowAudit items={adminWorkflowAudit.slice(0, 3)} />
        </div>
      </AdminCard>

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

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Workflow risk and readiness</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {workspace.alerts.map((alert) => (
              <Link key={alert.id} href={alert.href} className="rounded-2xl border border-line bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-soft/18">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-ink">{alert.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{alert.detail}</p>
                  </div>
                  <AdminStatusBadge status={alert.severity === "critical" ? "urgent" : alert.severity === "warning" ? "awaiting_review" : "paid"} label={alert.severity} />
                </div>
              </Link>
            ))}
            {workspace.alerts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-slate-50 p-4 text-sm leading-6 text-slate">
                No active workflow alerts right now. Intake, proofing, and production queues are currently clear.
              </div>
            ) : null}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Top product pressure</h2>
          <div className="mt-5 space-y-3">
            {workspace.topProductCategories.map((item) => (
              <div key={item.label} className="rounded-2xl border border-line bg-canvas p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-ink">{item.label}</p>
                  <p className="text-xl font-black text-ink">{item.count}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate">Jobs currently concentrated in this product family across quotes and orders.</p>
              </div>
            ))}
            {workspace.topProductCategories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-slate-50 p-4 text-sm leading-6 text-slate">
                Product pressure will appear here once live jobs start flowing through the admin system.
              </div>
            ) : null}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Production snapshot</h2>
          <p className="mt-3 text-sm leading-6 text-slate">See which approved jobs are printing, finishing, or still blocked before press release.</p>
          <div className="mt-5">
            <AdminProductionQueue jobs={workspace.productionQueue} />
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Role-based staff visibility</h2>
          <p className="mt-3 text-sm leading-6 text-slate">Different departments now share one job system while still seeing the work that matters most to them.</p>
          <div className="mt-5 space-y-3">
            {workspace.roleQueues.map((queue) => (
              <Link key={queue.id} href={queue.href} className="block rounded-2xl border border-line bg-canvas p-4 transition hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-soft/18">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-ink">{queue.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{queue.emphasis}</p>
                  </div>
                  <p className="text-2xl font-black text-ink">{queue.count}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {queue.items.slice(0, 3).map((item) => (
                    <AdminStatusBadge key={`${queue.id}-${item.reference}`} status={item.status} label={item.reference} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </AdminCard>
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
