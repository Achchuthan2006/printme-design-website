import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminKpiMetric } from "@/types";
import { cn } from "@/lib/utils";

function getToneClasses(tone?: AdminKpiMetric["tone"]) {
  switch (tone) {
    case "positive":
      return "border-emerald-200 bg-emerald-50/80 text-emerald-700";
    case "attention":
      return "border-amber-200 bg-amber-50/80 text-amber-700";
    default:
      return "border-line bg-canvas text-slate";
  }
}

function getDirectionClasses(direction?: AdminKpiMetric["direction"]) {
  switch (direction) {
    case "up":
      return "text-emerald-700";
    case "down":
      return "text-brand";
    default:
      return "text-slate";
  }
}

export function AdminKpiGrid({ items }: { items: AdminKpiMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => {
        const content = (
          <AdminCard className="liquid-glass flex h-full flex-col justify-between gap-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">{item.label}</p>
              {item.delta ? (
                <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]", getToneClasses(item.tone))}>
                  {item.delta}
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-4xl font-black tracking-[-0.05em] text-ink">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
            </div>
            {item.direction ? (
              <p className={cn("text-xs font-black uppercase tracking-[0.14em]", getDirectionClasses(item.direction))}>
                {item.direction === "up" ? "Improving" : item.direction === "down" ? "Needs attention" : "Monitoring"}
              </p>
            ) : null}
          </AdminCard>
        );

        if (!item.href) return <div key={item.label}>{content}</div>;

        return (
          <Link key={item.label} href={item.href} className="block h-full">
            {content}
          </Link>
        );
      })}
    </div>
  );
}
