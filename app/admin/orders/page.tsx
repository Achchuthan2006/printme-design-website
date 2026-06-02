import { AdminCard } from "@/components/admin/admin-card";
import { AdminOrdersOpsView } from "@/components/admin/admin-orders-ops-view";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminOperationsWorkspace } from "@/lib/backend/admin-operations";

export default async function AdminOrdersPage() {
  const workspace = await getAdminOperationsWorkspace();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Order management"
        description="Track paid jobs, deposits, artwork status, production movement, pickup readiness, and internal notes from one operations view."
        actionLabel="Open Quote Queue"
        actionHref="/admin/quotes"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Active orders</p><p className="mt-2 text-4xl font-black text-ink">{workspace.orders.length}</p><p className="mt-2 text-sm text-slate">Structured job tickets moving from intake through fulfillment.</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Awaiting review</p><p className="mt-2 text-4xl font-black text-ink">{workspace.orders.filter((order) => order.productionStatus === "awaiting_review" || order.productionStatus === "awaiting_files").length}</p><p className="mt-2 text-sm text-slate">Orders still blocked on specs, files, or readiness review.</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Proof or revision</p><p className="mt-2 text-4xl font-black text-ink">{workspace.orders.filter((order) => order.productionStatus === "waiting_for_proof_approval" || order.productionStatus === "revision_requested").length}</p><p className="mt-2 text-sm text-slate">Jobs waiting on proof movement before press release.</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Pickup / dispatch</p><p className="mt-2 text-4xl font-black text-ink">{workspace.orders.filter((order) => order.productionStatus === "ready_for_pickup").length}</p><p className="mt-2 text-sm text-slate">Completed work waiting on customer handoff or final closeout.</p></AdminCard>
      </div>

      <AdminCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Operations view</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate">
              Staff can now scan order type, payment readiness, proof state, production stage, and ownership from one grid instead of jumping between disconnected records.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {workspace.metrics.slice(3, 6).map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-line bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{metric.label}</p>
                <p className="mt-2 text-2xl font-black text-ink">{metric.value}</p>
                <p className="mt-2 text-xs leading-5 text-slate">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminOrdersOpsView orders={workspace.orders} />
    </div>
  );
}
