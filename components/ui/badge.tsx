import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand/20 bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand shadow-[0_10px_24px_rgba(22,19,17,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
