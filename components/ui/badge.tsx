import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}
