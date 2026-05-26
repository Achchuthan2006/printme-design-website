import { notFound } from "next/navigation";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminCustomers, adminUploads, adminWorkflowEvents, getAdminOrderById, orderStatusLabels, uploadStatusLabels } from "@/data/admin";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getAdminOrderById(id);
  if (!order) notFound();
  const customer = adminCustomers.find((item) => item.id === order.customerId);
  const linkedUploads = adminUploads.filter((upload) => upload.relatedTo === order.orderNumber);
  const relatedEvents = adminWorkflowEvents.filter((event) => event.entityId === order.id || event.entityId === order.customerId);

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

          {linkedUploads.length > 0 ? (
            <AdminCard>
              <h2 className="text-2xl font-black text-ink">Linked artwork</h2>
              <div className="mt-5 grid gap-3">
                {linkedUploads.map((upload) => (
                  <article key={upload.id} className="rounded-xl border border-line bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-black text-ink">{upload.fileName}</p>
                        <p className="mt-1 text-sm text-slate">{upload.fileType} / {upload.fileSize} / {upload.uploadedAt}</p>
                        <p className="mt-2 text-sm leading-6 text-slate">{upload.notes}</p>
                      </div>
                      <AdminStatusBadge status={upload.status} label={uploadStatusLabels[upload.status]} />
                    </div>
                  </article>
                ))}
              </div>
            </AdminCard>
          ) : null}

          <AdminActivityTimeline
            title="Internal activity and audit trail"
            items={
              relatedEvents.length > 0
                ? relatedEvents
                : order.activity.map((item, index) => ({
                    id: `${order.id}-${index}`,
                    entityType: "order" as const,
                    entityId: order.id,
                    title: item,
                    detail: "Legacy order activity record ready to migrate into canonical workflow events.",
                    actor: "Operations",
                    occurredAt: order.createdAt,
                    tone: "default" as const,
                  }))
            }
          />
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

          {customer ? (
            <AdminCard>
              <h2 className="text-xl font-black text-ink">Customer context</h2>
              <p className="mt-4 text-sm font-bold text-ink">{customer.name}{customer.company ? ` / ${customer.company}` : ""}</p>
              <p className="mt-1 text-sm text-slate">{customer.email}</p>
              <p className="mt-1 text-sm text-slate">{customer.phone}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {customer.tags.map((tag) => <AdminStatusBadge key={tag} status="normal" label={tag} />)}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate">{customer.notes}</p>
            </AdminCard>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
