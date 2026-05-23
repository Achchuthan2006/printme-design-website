import { Icon } from "@/components/ui/icon";

export function TrustStrip({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item} className="premium-surface flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold text-ink">{item}</p>
        </div>
      ))}
    </div>
  );
}
