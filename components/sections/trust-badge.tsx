import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  icon: string;
  title: string;
  detail?: string;
  className?: string;
}

export function TrustBadge({ icon, title, detail, className }: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border border-line bg-white px-4 py-3 shadow-soft transition duration-300 hover:border-brand/30 hover:bg-white hover:shadow-card",
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-extrabold text-ink">{title}</span>
        {detail ? <span className="block text-xs leading-5 text-slate">{detail}</span> : null}
      </span>
    </div>
  );
}
