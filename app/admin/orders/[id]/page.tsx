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
import { adminCustomers, orderStatusLabels, uploadStatusLabels } from "@/data/admin";
import { getProofPortalByOrderId } from "@/data/account";
import { getAdminOperationsWorkspace } from "@/lib/backend/admin-operations";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = await getAdminOperationsWorkspace();
  const order = workspace.orders.find((item) => item.id === id);
  if (!order) notFound();
  const customer =
    adminCustomers.find((item) => item.id === order.customerId) ??
    {
      name: order.customerName,
      company: order.customerCompany,
      email: order.customerEmail,
      phone: order.customerPhone,
      tags: [workspace.sourceLabel.toLowerCase().includes("live") ? "Live customer record" : "Preview customer record"],
      notes: "Customer context is assembled from the linked workflow record.",
    };
  const linkedUploads = workspace.uploads.filter((upload) => upload.relatedTo === order.orderNumber);
  const linkedProofPortal = workspace.source === "seed" ? getProofPortalByOrderId(order.id) : null;

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
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-ink">Job summary</h2>
                <p className="mt-2 text-sm leading-6 text-slate">
                  This page is the internal job ticket for intake, proofing, production, and customer follow-up.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminStatusBadge status={order.priority} />
                <AdminStatusBadge status={order.paymentStatus} />
                <AdminStatusBadge status={order.fileStatus} label={uploadStatusLabels[order.fileStatus]} />
                <AdminStatusBadge status={order.productionStatus} label={orderStatusLabels[order.productionStatus]} />
              </div>
            </div>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Customer", order.customerName],
                ["Company", order.customerCompany ?? "Not provided"],
                ["Email", order.customerEmail],
                ["Phone", order.customerPhone],
                ["Product", order.service],
                ["Fulfillment", order.fulfillmentMethod],
                ["Total", order.total],
                ["Payment stage", order.paymentStageLabel ?? order.paymentStatus.replaceAll("_", " ")],
                ["Amount due", order.amountDue ?? "Nothing due"],
                ["Due date", order.dueDate],
                ["Turnaround", order.turnaroundExpectation ?? "Standard workflow"],
                ["Order method", order.orderMethod.replaceAll("-", " ")],
                ["Production stage", order.productionStage.replaceAll("-", " ")],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-slate-50 p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</dt>
                  <dd className="mt-2 font-black text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </AdminCard>

          <AdminCard>
            <h2 className="text-2xl font-black text-ink">Selected specs and instructions</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {order.selectedSpecs.map((item) => (
                <li key={item} className="rounded-xl border border-line px-4 py-3 text-sm font-bold text-slate">
                  {item}
                </li>
              ))}
            </ul>
            {order.templateTitle || order.customizationSummary || order.requestedEdits?.length || order.customerInstructions?.length ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Template / customization</p>
                  <p className="mt-2 text-sm leading-6 text-slate">
                    {order.templateTitle ? `${order.templateTitle}. ` : ""}
                    {order.customizationSummary ?? "No template customization summary recorded."}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Requested edits and instructions</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate">
                    {order.requestedEdits?.map((item) => <p key={item}>{item}</p>)}
                    {order.customerInstructions?.map((item) => <p key={item}>{item}</p>)}
                  </div>
                </div>
              </div>
            ) : null}
          </AdminCard>

          <AdminFileWorkflowPanel
            uploads={linkedUploads}
            orderMethod={order.orderMethod}
            templateTitle={order.templateTitle}
            designRequired={order.designRequired}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <AdminReadinessPanel title="Commercial readiness" items={order.commercialReadiness} />
            <AdminReadinessPanel title="Artwork readiness" items={order.fileChecklist} />
          </div>

          {order.paymentPlan ? (
            <AdminCard>
              <h2 className="text-2xl font-black text-ink">Payment and release policy</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Payment path</p>
                  <p className="mt-2 font-black text-ink">{order.paymentPlan.paymentHeadline}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{order.amountPaid ? `Paid: ${order.amountPaid}` : "No captured payment yet."}</p>
                  {order.amountDue ? <p className="text-sm leading-6 text-slate">Still due: {order.amountDue}</p> : null}
                </div>
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Production gate</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate">
                    {order.paymentPlan.blocksProductionUntil.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </AdminCard>
          ) : null}

          <AdminCommunicationPanel items={order.communication} />
          <AdminProofPortalBridge proof={linkedProofPortal} />

          <AdminActivityTimeline
            title="Internal activity and audit trail"
            items={
              order.activity.length > 0
                ? order.activity.map((item, index) => ({
                    id: `${order.id}-${index}`,
                    entityType: "order" as const,
                    entityId: order.id,
                    title: item.replaceAll(".", " "),
                    detail: "Operational workflow event captured for this job ticket.",
                    actor: "Operations",
                    occurredAt: order.createdAt,
                    tone: "default" as const,
                  }))
                : [{
                    id: `${order.id}-created`,
                    entityType: "order" as const,
                    entityId: order.id,
                    title: "Order created",
                    detail: "This job is ready for intake, proofing, and production follow-up.",
                    actor: "Operations",
                    occurredAt: order.createdAt,
                    tone: "default" as const,
                  }]
            }
          />
        </div>

        <aside className="space-y-6">
          <AdminCard>
            <h2 className="text-xl font-black text-ink">Workflow controls</h2>
            <p className="mt-2 text-sm leading-6 text-slate">Use these actions to move the job cleanly between intake, proofing, production, and fulfillment.</p>
            <div className="mt-5 space-y-2">
              {["Update status", "Send customer update", "Request missing detail", "Put on hold", "Close job complete"].map((action) => (
                <button key={action} className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-black text-ink transition hover:border-brand/40 hover:bg-brand-soft/30">
                  {action}
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminAssignmentPanel assignment={order.assignment} blockers={order.blockers} nextAction={order.nextAction} priority={order.priority} />

          <AdminProofWorkflowPanel proof={order.proof} />

          <AdminLifecyclePanel title="Order lifecycle" items={order.milestones} />

          <AdminReadinessPanel title="Production readiness" items={order.productionChecklist} />

          <AdminCard>
            <h2 className="text-xl font-black text-ink">Internal notes</h2>
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
