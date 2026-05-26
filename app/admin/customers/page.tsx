import { AdminCard } from "@/components/admin/admin-card";
import { AdminCustomersOpsView } from "@/components/admin/admin-customers-ops-view";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Customers</p><p className="mt-2 text-4xl font-black text-ink">{adminCustomers.length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Repeat buyers</p><p className="mt-2 text-4xl font-black text-ink">{adminCustomers.filter((customer) => customer.tags.includes("Repeat buyer")).length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Rush-oriented</p><p className="mt-2 text-4xl font-black text-ink">{adminCustomers.filter((customer) => customer.tags.includes("Rush jobs")).length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Large-format clients</p><p className="mt-2 text-4xl font-black text-ink">{adminCustomers.filter((customer) => customer.tags.includes("Large format")).length}</p></AdminCard>
      </div>
      <AdminCustomersOpsView customers={adminCustomers} />
    </div>
  );
}
