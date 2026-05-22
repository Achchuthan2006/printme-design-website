import { notFound } from "next/navigation";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { getAdminOrderById, orderStatusLabels, uploadStatusLabels } from "@/data/admin";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Order detail"
        title={`${order.orderNumber} / ${order.service}`}
        description="Review customer details, selected print options, files, payment state, production status, and staff notes before the next action."
        actionLabel="Back to Orders"
        actionHref="/admin/orders"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Job summary</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Customer", order.customerName],
                ["Email", order.customerEmail],
                ["Phone", order.customerPhone],
                ["Fulfillment", order.fulfillmentMethod],
                ["Total", order.total],
                ["Due date", order.dueDate],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</dt>
                  <dd className="mt-2 font-black text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Selected options</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {order.items.map((item) => (
                <li key={item} className="rounded-xl border border-line px-4 py-3 text-sm font-bold text-slate">
                  {item}
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Internal activity</h2>
            <ol className="mt-5 space-y-3">
              {order.activity.map((item) => (
                <li key={item} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-slate">
                  {item}
                </li>
              ))}
            </ol>
          </AdminCard>
        </div>

        <aside className="space-y-6">
          <AdminCard>
            <h2 className="text-xl font-black text-ink">Workflow status</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <AdminStatusBadge status={order.priority} />
              <AdminStatusBadge status={order.paymentStatus} />
              <AdminStatusBadge status={order.fileStatus} label={uploadStatusLabels[order.fileStatus]} />
              <AdminStatusBadge status={order.productionStatus} label={orderStatusLabels[order.productionStatus]} />
            </div>
            <div className="mt-5 space-y-2">
              {["Move to production", "Mark ready for pickup", "Send customer update", "Put on hold"].map((action) => (
                <button key={action} className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-black text-ink transition hover:border-brand/40 hover:bg-brand-soft/30">
                  {action}
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-xl font-black text-ink">Staff notes</h2>
            <div className="mt-4 space-y-3">
              {order.internalNotes.map((note) => (
                <p key={note} className="rounded-xl border border-line bg-slate-50 p-3 text-sm leading-6 text-slate">{note}</p>
              ))}
            </div>
            <textarea className="mt-4 min-h-28 w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Add internal note..." />
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
