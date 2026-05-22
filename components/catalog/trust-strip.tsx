import { Icon } from "@/components/ui/icon";

export function TrustStrip({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 shadow-soft">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold text-ink">{item}</p>
        </div>
      ))}
    </div>
  );
}
