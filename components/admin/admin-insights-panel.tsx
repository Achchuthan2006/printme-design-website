import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInsightRow } from "@/types";

export function AdminInsightsPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: AdminInsightRow[];
}) {
  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate">{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => {
          const inner = (
            <div className="rounded-2xl border border-line bg-canvas px-4 py-4 transition hover:border-brand/25 hover:bg-brand-soft/15">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black text-ink">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
                  {item.change ? (
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-brand">{item.change}</p>
                  ) : null}
                </div>
                <p className="text-2xl font-black tracking-[-0.04em] text-ink">{item.value}</p>
              </div>
            </div>
          );

          if (!item.href) return <div key={item.label}>{inner}</div>;

          return (
            <Link key={item.label} href={item.href} className="block">
              {inner}
            </Link>
          );
        })}
      </div>
    </AdminCard>
  );
}
