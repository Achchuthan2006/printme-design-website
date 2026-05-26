import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminOperationalAlert } from "@/types";
import { cn } from "@/lib/utils";

function alertClasses(severity: AdminOperationalAlert["severity"]) {
  switch (severity) {
    case "critical":
      return "border-brand/35 bg-brand-soft/25";
    case "warning":
      return "border-amber-300 bg-amber-50";
    case "positive":
      return "border-emerald-300 bg-emerald-50";
    default:
      return "border-line bg-canvas";
  }
}

function badgeClasses(severity: AdminOperationalAlert["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-brand text-white";
    case "warning":
      return "bg-amber-500 text-ink";
    case "positive":
      return "bg-emerald-600 text-white";
    default:
      return "bg-slate-200 text-ink";
  }
}

export function AdminAlertCenter({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: AdminOperationalAlert[];
}) {
  return (
    <AdminCard>
      <div>
        <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate">{description}</p>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className={cn("rounded-2xl border px-4 py-4", alertClasses(item.severity))}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]", badgeClasses(item.severity))}>
                    {item.severity}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate">{item.category}</span>
                </div>
                <p className="mt-2 text-base font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-slate">{item.ageLabel}</p>
              </div>
              <Link href={item.href} className="rounded-full bg-ink px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand">
                {item.actionLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
