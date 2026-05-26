import { notFound } from "next/navigation";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminCustomers, adminUploads, adminWorkflowEvents, getAdminQuoteById, quoteStatusLabels, uploadStatusLabels } from "@/data/admin";

export default async function AdminQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = getAdminQuoteById(id);
  if (!quote) notFound();
  const customer = adminCustomers.find((item) => item.id === quote.customerId);
  const linkedUploads = adminUploads.filter((upload) => upload.relatedTo === quote.quoteNumber);
  const relatedEvents = adminWorkflowEvents.filter((event) => event.entityId === quote.id || event.entityId === quote.customerId);

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

        {linkedUploads.length > 0 ? (
          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Attached files</h2>
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
          title="Quote history and staff actions"
          items={
            relatedEvents.length > 0
              ? relatedEvents
              : quote.internalNotes.map((note, index) => ({
                  id: `${quote.id}-${index}`,
                  entityType: "quote" as const,
                  entityId: quote.id,
                  title: "Internal quote note",
                  detail: note,
                  actor: "Sales desk",
                  occurredAt: quote.createdAt,
                  tone: "default" as const,
                }))
          }
        />

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
