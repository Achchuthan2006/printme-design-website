import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface StatusTimelineItem {
  label: string;
  detail: string;
  status: "done" | "current" | "upcoming" | "attention";
}

const statusStyles: Record<StatusTimelineItem["status"], { dot: string; line: string; card: string; icon: string }> = {
  done: {
    dot: "border-emerald-200 bg-emerald-500",
    line: "bg-emerald-200",
    card: "border-emerald-100 bg-emerald-50/70",
    icon: "check",
  },
  current: {
    dot: "border-brand/20 bg-brand",
    line: "bg-brand/20",
    card: "border-brand/15 bg-brand-soft/65",
    icon: "clock",
  },
  upcoming: {
    dot: "border-line bg-white",
    line: "bg-line",
    card: "border-line/90 bg-white",
    icon: "document",
  },
  attention: {
    dot: "border-amber-200 bg-amber-400",
    line: "bg-amber-200",
    card: "border-amber-200 bg-amber-50/80",
    icon: "chat",
  },
};

export function StatusTimeline({
  title,
  items,
  compact = false,
}: {
  title?: string;
  items: StatusTimelineItem[];
  compact?: boolean;
}) {
  return (
    <section className="surface-card p-5 sm:p-6">
      {title ? <h2 className="text-xl font-black text-ink">{title}</h2> : null}
      <div className={cn("mt-5 space-y-4", compact && "space-y-3")}>
        {items.map((item, index) => {
          const style = statusStyles[item.status];
          const last = index === items.length - 1;
          return (
            <div key={`${item.label}-${index}`} className="grid grid-cols-[2.4rem_1fr] gap-3">
              <div className="relative flex justify-center">
                <span className={cn("mt-1 flex h-10 w-10 items-center justify-center rounded-full border text-white", style.dot)}>
                  <Icon name={style.icon} className={cn("h-4 w-4", item.status === "upcoming" ? "text-slate" : "text-white")} />
                </span>
                {!last ? <span className={cn("absolute top-12 h-[calc(100%-1.5rem)] w-px", style.line)} aria-hidden="true" /> : null}
              </div>
              <div className={cn("rounded-[1.2rem] border p-4", style.card, compact && "p-3.5")}>
                <p className="text-sm font-black text-ink">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
