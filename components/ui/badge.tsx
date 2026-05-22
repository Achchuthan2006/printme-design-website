import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand/15 bg-brand-soft px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
