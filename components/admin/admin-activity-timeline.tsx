import { AdminWorkflowEvent } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";
import { cn } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  default: "border-line bg-white",
  attention: "border-amber-200 bg-amber-50/70",
  success: "border-emerald-200 bg-emerald-50/70",
};

export function AdminActivityTimeline({
  title,
  items,
}: {
  title: string;
  items: AdminWorkflowEvent[];
}) {
  return (
    <AdminCard>
      <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <article key={item.id} className={cn("rounded-2xl border p-4", toneClasses[item.tone ?? "default"])}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate">
                  {item.entityType} / {item.actor}
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.12em] text-slate">{item.occurredAt}</span>
            </div>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}
