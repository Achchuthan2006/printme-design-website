import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminUrgentTask } from "@/types";

export function AdminQueuePanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: AdminUrgentTask[];
}) {
  return (
    <AdminCard>
      <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block rounded-2xl border border-line p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:bg-brand-soft/20"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate">{item.category}</p>
              </div>
              <AdminStatusBadge status={item.priority} />
            </div>
          </Link>
        ))}
      </div>
    </AdminCard>
  );
}
