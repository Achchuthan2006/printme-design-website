import { AdminCommunicationItem } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";

export function AdminCommunicationPanel({ items }: { items: AdminCommunicationItem[] }) {
  return (
    <AdminCard>
      <h2 className="text-2xl font-black text-ink">Communication</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-line bg-canvas p-4">
            <p className="text-sm font-black text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
