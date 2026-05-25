import { cn } from "@/lib/utils";

export interface SummaryStripItem {
  label: string;
  value: string;
  detail?: string;
}

export function SummaryStrip({
  items,
  className,
}: {
  items: SummaryStripItem[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-4", className)}>
      {items.map((item) => (
        <article key={`${item.label}-${item.value}`} className="premium-card premium-surface p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{item.label}</p>
          <p className="mt-3 text-3xl font-black text-ink">{item.value}</p>
          {item.detail ? <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p> : null}
        </article>
      ))}
    </div>
  );
}
