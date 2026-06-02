import { AdminCard } from "@/components/admin/admin-card";

export function AdminReadinessPanel({
  title,
  items,
}: {
  title: string;
  items?: Array<{ label: string; status: string; note: string }>;
}) {
  if (!items?.length) return null;

  return (
    <AdminCard>
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-sm font-black text-ink">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate">{item.note}</p>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
