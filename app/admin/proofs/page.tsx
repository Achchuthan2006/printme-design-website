import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { adminOrders, adminQuotes } from "@/data/admin";

export default function AdminProofsPage() {
  const items = [...adminOrders, ...adminQuotes];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Proofs" description="Proof-sensitive jobs and revision-aware workflow visibility." />
      <div className="grid gap-4">
        {items.map((item) => (
          <AdminCard key={item.id}>
            <p className="text-sm font-black text-ink">{"orderNumber" in item ? item.orderNumber : item.quoteNumber}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{item.proof.lastAction}</p>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
