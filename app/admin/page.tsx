import Link from "next/link";
import { AdminCard, AdminMetricCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminDashboardMetrics, adminMessages, adminOrders, adminQuotes, adminUploads, orderStatusLabels, quoteStatusLabels, uploadStatusLabels } from "@/data/admin";

export default function AdminDashboardPage() {
  const priorityJobs = [...adminOrders]
    .filter((order) => ["urgent", "high"].includes(order.priority))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Operations dashboard"
        description="A practical command center for PrintMe staff to review new quotes, move jobs through production, inspect files, and keep customers updated."
        actionLabel="Review New Quotes"
        actionHref="/admin/quotes"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminDashboardMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Priority workflow</h2>
              <p className="mt-1 text-sm text-slate">Jobs that need a staff decision, proof check, or handoff soon.</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-black text-brand hover:text-brand-dark">
              View orders
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {priorityJobs.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="block rounded-2xl border border-line p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:bg-brand-soft/20">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-black text-ink">{order.orderNumber} / {order.service}</p>
                    <p className="mt-1 text-sm text-slate">{order.customerName} / due {order.dueDate} / {order.fulfillmentMethod}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AdminStatusBadge status={order.priority} />
                    <AdminStatusBadge status={order.productionStatus} label={orderStatusLabels[order.productionStatus]} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Today&apos;s attention</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-line bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Quote follow-up</p>
              <p className="mt-2 text-sm font-bold text-ink">{adminQuotes[0].quoteNumber}: {adminQuotes[0].service}</p>
              <AdminStatusBadge status={adminQuotes[0].status} label={quoteStatusLabels[adminQuotes[0].status]} />
            </div>
            <div className="rounded-2xl border border-line bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Artwork review</p>
              <p className="mt-2 text-sm font-bold text-ink">{adminUploads[1].fileName}</p>
              <AdminStatusBadge status={adminUploads[1].status} label={uploadStatusLabels[adminUploads[1].status]} />
            </div>
            <div className="rounded-2xl border border-line bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">New message</p>
              <p className="mt-2 text-sm font-bold text-ink">{adminMessages[0].subject}</p>
              <p className="mt-1 text-xs leading-5 text-slate">{adminMessages[0].summary}</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
