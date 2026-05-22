import { Icon } from "@/components/ui/icon";
import { printReadyChecklist } from "@/data/support";
import { cn } from "@/lib/utils";

interface PrintReadyChecklistProps {
  compact?: boolean;
  className?: string;
}

export function PrintReadyChecklist({ compact = false, className }: PrintReadyChecklistProps) {
  return (
    <section className={cn("rounded-2xl border border-line/90 bg-white p-6 shadow-soft", className)}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Before you upload</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Avoid the common print delays</h2>
      <div className={cn("mt-5 grid gap-3", compact ? "sm:grid-cols-2" : "md:grid-cols-2")}>
        {printReadyChecklist.map((item) => (
          <div key={item} className="flex gap-3 rounded-xl border border-line/80 bg-canvas p-3">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="text-sm font-bold leading-6 text-ink">{item}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate">
        Not sure if your file is ready? Upload what you have. A review before production can prevent sizing, bleed, colour, and font issues.
      </p>
    </section>
  );
}
