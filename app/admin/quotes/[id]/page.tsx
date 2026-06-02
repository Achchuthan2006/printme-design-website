import { notFound } from "next/navigation";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
import { AdminAssignmentPanel } from "@/components/admin/admin-assignment-panel";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminCommunicationPanel } from "@/components/admin/admin-communication-panel";
import { AdminFileWorkflowPanel } from "@/components/admin/admin-file-workflow-panel";
import { AdminLifecyclePanel } from "@/components/admin/admin-lifecycle-panel";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminProofPortalBridge } from "@/components/admin/admin-proof-portal-bridge";
import { AdminProofWorkflowPanel } from "@/components/admin/admin-proof-workflow-panel";
import { AdminReadinessPanel } from "@/components/admin/admin-readiness-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminCustomers, quoteStatusLabels } from "@/data/admin";
import { getProofPortalByQuoteId } from "@/data/account";
import { getAdminOperationsWorkspace } from "@/lib/backend/admin-operations";

export default async function AdminQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = await getAdminOperationsWorkspace();
  const quote = workspace.quotes.find((item) => item.id === id);
  if (!quote) notFound();
  const customer =
    adminCustomers.find((item) => item.id === quote.customerId) ??
    {
      name: quote.customerName,
      company: quote.customerCompany,
      email: quote.customerEmail,
      phone: quote.customerPhone,
      tags: [workspace.sourceLabel.toLowerCase().includes("live") ? "Live customer record" : "Preview customer record"],
      notes: "Customer context is assembled from the linked workflow record.",
    };
  const linkedUploads = workspace.uploads.filter((upload) => upload.relatedTo === quote.quoteNumber);
  const linkedProofPortal = workspace.source === "seed" ? getProofPortalByQuoteId(quote.id) : null;

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
        <div className="space-y-6">
          <AdminCard>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-ink">Customer request</h2>
                <p className="mt-2 text-sm leading-6 text-slate">
                  This quote ticket keeps specs, files, proof planning, and follow-up in one place until the job becomes production-ready.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminStatusBadge status={quote.priority} />
                <AdminStatusBadge status={quote.status} label={quoteStatusLabels[quote.status]} />
              </div>
            </div>
            <p className="mt-4 rounded-2xl border border-line bg-slate-50 p-4 text-sm leading-7 text-slate">{quote.projectDetails}</p>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Customer", quote.customerName],
                ["Company", quote.customerCompany ?? "Not provided"],
                ["Email", quote.customerEmail],
                ["Phone", quote.customerPhone],
                ["Product", quote.service],
                ["Quantity", quote.quantity],
                ["Deadline", quote.deadline],
                ["Estimated value", quote.estimatedValue],
                ["Payment path", quote.paymentStageLabel ?? "Quote approval before payment"],
                ["Turnaround", quote.turnaroundExpectation ?? "To be confirmed"],
                ["Order method", quote.orderMethod.replaceAll("-", " ")],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-white p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</dt>
                  <dd className="mt-2 font-black text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Selected specs and design direction</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {quote.selectedSpecs.map((item) => (
                <li key={item} className="rounded-xl border border-line px-4 py-3 text-sm font-bold text-slate">
                  {item}
                </li>
              ))}
            </ul>
            {quote.templateTitle || quote.requestedEdits?.length ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Template / source path</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{quote.templateTitle ?? "No template selected for this quote."}</p>
                </div>
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Requested edits or scoping notes</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate">
                    {quote.requestedEdits?.map((item) => <p key={item}>{item}</p>)}
                  </div>
                </div>
              </div>
            ) : null}
          </AdminCard>

          <AdminFileWorkflowPanel
            uploads={linkedUploads}
            orderMethod={quote.orderMethod}
            templateTitle={quote.templateTitle}
            designRequired={quote.designRequired}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <AdminReadinessPanel title="Commercial readiness" items={quote.commercialReadiness} />
            <AdminReadinessPanel title="Artwork readiness" items={quote.fileChecklist} />
          </div>

          {quote.paymentPlan ? (
            <AdminCard>
              <h2 className="text-2xl font-black text-ink">Payment handoff</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Customer billing path</p>
                  <p className="mt-2 font-black text-ink">{quote.paymentPlan.paymentHeadline}</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate">
                    {quote.paymentPlan.customerNotes.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Release conditions</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate">
                    {quote.paymentPlan.blocksProductionUntil.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </AdminCard>
          ) : null}

          <AdminCommunicationPanel items={quote.communication} />
          <AdminProofPortalBridge proof={linkedProofPortal} />

          <AdminActivityTimeline
            title="Quote history and staff actions"
            items={
              quote.communication.length > 0
                ? quote.communication.map((item, index) => ({
                    id: `${quote.id}-${index}`,
                    entityType: "quote" as const,
                    entityId: quote.id,
                    title: item.title,
                    detail: item.detail,
                    actor: item.direction === "customer" ? "Customer follow-up" : "Sales desk",
                    occurredAt: item.happenedAt,
                    tone: item.direction === "customer" ? "attention" as const : "default" as const,
                  }))
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
        </div>

        <aside className="space-y-6">
          <AdminCard>
            <h2 className="text-xl font-black text-ink">Quote controls</h2>
            <p className="mt-2 text-sm leading-6 text-slate">Keep the pricing, proof, and follow-up path explicit before this quote becomes an order.</p>
            <div className="mt-5 space-y-2">
              {["Request missing files", "Send quote", "Convert to order", "Send proof update", "Close quote"].map((action) => (
                <button key={action} className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-black text-ink transition hover:border-brand/40 hover:bg-brand-soft/30">
                  {action}
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminAssignmentPanel assignment={quote.assignment} blockers={quote.blockers} nextAction={quote.nextAction} priority={quote.priority} />

          <AdminProofWorkflowPanel proof={quote.proof} />

          <AdminLifecyclePanel title="Quote lifecycle" items={quote.milestones} />

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
