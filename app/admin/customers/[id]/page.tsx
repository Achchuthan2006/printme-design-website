import { notFound } from "next/navigation";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminOrders, adminQuotes, adminUploads, getAdminCustomerById, quoteStatusLabels, uploadStatusLabels } from "@/data/admin";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = getAdminCustomerById(id);
  if (!customer) notFound();

  const customerOrders = adminOrders.filter((order) => order.customerId === id);
  const customerQuotes = adminQuotes.filter((quote) => quote.customerId === id);
  const customerUploads = adminUploads.filter((upload) => upload.customerName === customer.name);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customer detail"
        title={customer.company ? `${customer.name} / ${customer.company}` : customer.name}
        description="See the customer relationship, recent jobs, quote activity, uploads, and internal notes in one place before replying or restarting a job."
        actionLabel="Back to Customers"
        actionHref="/admin/customers"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Customer summary</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Email", customer.email],
                ["Phone", customer.phone],
                ["Last activity", customer.lastActivity],
                ["Lifetime value", customer.lifetimeValue],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</dt>
                  <dd className="mt-2 font-black text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {customer.tags.map((tag) => <AdminStatusBadge key={tag} status="normal" label={tag} />)}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Recent orders</h2>
            <div className="mt-5 space-y-3">
              {customerOrders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-ink">{order.orderNumber} / {order.service}</p>
                      <p className="mt-1 text-sm text-slate">{order.total} / due {order.dueDate}</p>
                    </div>
                    <AdminStatusBadge status={order.productionStatus} />
                  </div>
                </article>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Quotes and uploads</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                {customerQuotes.map((quote) => (
                  <article key={quote.id} className="rounded-2xl border border-line bg-slate-50 p-4">
                    <p className="font-black text-ink">{quote.quoteNumber} / {quote.service}</p>
                    <p className="mt-1 text-sm text-slate">{quote.followUp}</p>
                    <div className="mt-3">
                      <AdminStatusBadge status={quote.status} label={quoteStatusLabels[quote.status]} />
                    </div>
                  </article>
                ))}
              </div>
              <div className="space-y-3">
                {customerUploads.map((upload) => (
                  <article key={upload.id} className="rounded-2xl border border-line bg-slate-50 p-4">
                    <p className="font-black text-ink">{upload.fileName}</p>
                    <p className="mt-1 text-sm text-slate">{upload.relatedTo}</p>
                    <div className="mt-3">
                      <AdminStatusBadge status={upload.status} label={uploadStatusLabels[upload.status]} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-6">
          <AdminCard>
            <h2 className="text-xl font-black text-ink">Relationship notes</h2>
            <p className="mt-4 rounded-xl border border-line bg-slate-50 p-3 text-sm leading-6 text-slate">
              {customer.notes ?? "Ready for staff notes, saved addresses, invoicing preferences, and repeat-job instructions."}
            </p>
            <textarea className="mt-4 min-h-28 w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Add account note, credit note, or repeat-order preference..." />
          </AdminCard>

          <AdminCard>
            <h2 className="text-xl font-black text-ink">Quick actions</h2>
            <div className="mt-4 space-y-2">
              {["Open latest order", "Open latest quote", "Request updated files", "Send support follow-up"].map((action) => (
                <button key={action} className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-black text-ink transition hover:border-brand/40 hover:bg-brand-soft/30">
                  {action}
                </button>
              ))}
            </div>
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
