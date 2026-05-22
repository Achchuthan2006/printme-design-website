import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminInvoices } from "@/data/admin";

export default function AdminInvoicesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Invoices"
        description="Prepare invoice generation, payment status tracking, PDF downloads, and customer billing history for the print-commerce workflow."
        actionLabel="Open Orders"
        actionHref="/admin/orders"
      />
      <AdminFilterBar>
        {["All", "Draft", "Sent", "Paid", "Overdue"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["Invoice", "Customer", "Order", "Amount", "Status", "Issued", "Due", "Action"]}
        rows={adminInvoices.map((invoice) => [
          <span key="invoice">{invoice.invoiceNumber}</span>,
          <span key="customer">{invoice.customerName}</span>,
          <span key="order">{invoice.relatedOrder}</span>,
          <span key="amount">{invoice.amount}</span>,
          <AdminStatusBadge key="status" status={invoice.status} />,
          <span key="issued">{invoice.issuedAt}</span>,
          <span key="due">{invoice.dueAt}</span>,
          <button key="action" className="font-black text-brand hover:text-brand-dark">Download</button>,
        ])}
      />
    </div>
  );
}
