import { AdminCard } from "@/components/admin/admin-card";
import { AdminOrdersOpsView } from "@/components/admin/admin-orders-ops-view";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminOrders } from "@/data/admin";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Order management"
        description="Track paid jobs, deposits, artwork status, production movement, pickup readiness, and internal notes from one operations view."
        actionLabel="Open Quote Queue"
        actionHref="/admin/quotes"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Active orders</p><p className="mt-2 text-4xl font-black text-ink">{adminOrders.length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Awaiting review</p><p className="mt-2 text-4xl font-black text-ink">{adminOrders.filter((order) => order.productionStatus === "awaiting_review").length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Production</p><p className="mt-2 text-4xl font-black text-ink">{adminOrders.filter((order) => order.productionStatus === "in_production").length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Pickup / dispatch</p><p className="mt-2 text-4xl font-black text-ink">{adminOrders.filter((order) => order.productionStatus === "ready_for_pickup").length}</p></AdminCard>
      </div>
      <AdminOrdersOpsView orders={adminOrders} />
    </div>
  );
}
