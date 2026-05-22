import Link from "next/link";
import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminOrders, orderStatusLabels, uploadStatusLabels } from "@/data/admin";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Order management"
        description="Track paid jobs, deposits, artwork status, production movement, pickup readiness, and internal notes from one operations view."
        actionLabel="Open Quote Queue"
        actionHref="/admin/quotes"
      />
      <AdminFilterBar>
        {["All", "Awaiting Review", "In Production", "Ready for Pickup", "On Hold"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["Order", "Customer", "Service", "Payment", "Files", "Production", "Due", "Action"]}
        rows={adminOrders.map((order) => [
          <div key="order">
            <Link href={`/admin/orders/${order.id}`} className="text-brand hover:text-brand-dark">{order.orderNumber}</Link>
            <p className="mt-1 text-xs text-slate">{order.createdAt}</p>
          </div>,
          <div key="customer">
            <p>{order.customerName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{order.customerEmail}</p>
          </div>,
          <span key="service">{order.service}</span>,
          <AdminStatusBadge key="payment" status={order.paymentStatus} />,
          <AdminStatusBadge key="files" status={order.fileStatus} label={uploadStatusLabels[order.fileStatus]} />,
          <AdminStatusBadge key="production" status={order.productionStatus} label={orderStatusLabels[order.productionStatus]} />,
          <span key="due">{order.dueDate}</span>,
          <Link key="action" href={`/admin/orders/${order.id}`} className="font-black text-brand hover:text-brand-dark">View</Link>,
        ])}
      />
    </div>
  );
}
