import { Icon } from "@/components/ui/icon";
import { localTrustItems } from "@/data/cro";

export function LocalTrustStrip({ items = localTrustItems }: { items?: typeof localTrustItems }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-line/90 bg-white p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-brand-soft text-brand">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black text-ink">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
