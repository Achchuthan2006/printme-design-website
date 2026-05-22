import { notFound } from "next/navigation";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { getAdminQuoteById, quoteStatusLabels } from "@/data/admin";

export default async function AdminQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = getAdminQuoteById(id);
  if (!quote) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Quote detail"
        title={`${quote.quoteNumber} / ${quote.service}`}
        description="Review the request, confirm missing specs, prepare pricing, and keep follow-up status visible for staff."
        actionLabel="Back to Quotes"
        actionHref="/admin/quotes"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <AdminCard>
          <h2 className="text-2xl font-black text-ink">Customer request</h2>
          <p className="mt-4 rounded-2xl border border-line bg-slate-50 p-4 text-sm leading-7 text-slate">{quote.projectDetails}</p>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["Customer", quote.customerName],
              ["Email", quote.customerEmail],
              ["Phone", quote.customerPhone],
              ["Quantity", quote.quantity],
              ["Deadline", quote.deadline],
              ["Estimated value", quote.estimatedValue],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-white p-4">
                <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</dt>
                <dd className="mt-2 font-black text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        <aside className="space-y-6">
          <AdminCard>
            <h2 className="text-xl font-black text-ink">Quote status</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <AdminStatusBadge status={quote.priority} />
              <AdminStatusBadge status={quote.status} label={quoteStatusLabels[quote.status]} />
            </div>
            <div className="mt-5 space-y-2">
              {["Request missing files", "Mark quoted", "Convert to order", "Close quote"].map((action) => (
                <button key={action} className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-black text-ink transition hover:border-brand/40 hover:bg-brand-soft/30">
                  {action}
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-xl font-black text-ink">Internal notes</h2>
            <div className="mt-4 space-y-3">
              {quote.internalNotes.map((note) => (
                <p key={note} className="rounded-xl border border-line bg-slate-50 p-3 text-sm leading-6 text-slate">{note}</p>
              ))}
            </div>
            <textarea className="mt-4 min-h-28 w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Add pricing, file, or follow-up note..." />
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
