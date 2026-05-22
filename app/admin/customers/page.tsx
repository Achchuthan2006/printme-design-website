import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminCustomers } from "@/data/admin";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer management"
        description="Search customers, review contact details, understand order history context, and prepare for account notes, tags, and repeat-order workflows."
        actionLabel="Open Messages"
        actionHref="/admin/messages"
      />
      <AdminFilterBar>
        {["All", "Repeat buyers", "Rush jobs", "Large format", "Marketing"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["Customer", "Contact", "Company", "Tags", "Last activity", "Value", "Notes"]}
        rows={adminCustomers.map((customer) => [
          <span key="name">{customer.name}</span>,
          <div key="contact">
            <p>{customer.email}</p>
            <p className="mt-1 text-xs font-normal text-slate">{customer.phone}</p>
          </div>,
          <span key="company">{customer.company ?? "Individual customer"}</span>,
          <div key="tags" className="flex flex-wrap gap-2">
            {customer.tags.map((tag) => <AdminStatusBadge key={tag} status="normal" label={tag} />)}
          </div>,
          <span key="activity">{customer.lastActivity}</span>,
          <span key="value">{customer.lifetimeValue}</span>,
          <span key="notes" className="max-w-xs text-slate">{customer.notes ?? "Ready for notes, tags, and account history."}</span>,
        ])}
      />
    </div>
  );
}
