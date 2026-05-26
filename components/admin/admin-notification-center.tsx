import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminNotificationIntelligenceItem } from "@/types";
import { cn } from "@/lib/utils";

function statusClasses(status: AdminNotificationIntelligenceItem["status"]) {
  switch (status) {
    case "sent":
      return "bg-emerald-50 text-emerald-700";
    case "failed":
      return "bg-brand-soft/30 text-brand";
    case "action_needed":
      return "bg-amber-50 text-amber-700";
    case "queued":
      return "bg-canvas text-slate";
    default:
      return "bg-slate-100 text-slate";
  }
}

export function AdminNotificationCenter({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: AdminNotificationIntelligenceItem[];
}) {
  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate">{description}</p>
        </div>
        <Link href="/admin/messages" className="text-sm font-black text-brand hover:text-brand-dark">
          Open inbox
        </Link>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block rounded-2xl border border-line bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-soft/12"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate">
                    {item.channel}
                  </span>
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                    {item.audience}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate">{item.priority}</span>
                </div>
                <p className="mt-2 text-base font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
              </div>
              <div className="md:text-right">
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]", statusClasses(item.status))}>
                  {item.status.replaceAll("_", " ")}
                </span>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-slate">{item.happenedAt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminCard>
  );
}
