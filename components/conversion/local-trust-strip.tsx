import { Icon } from "@/components/ui/icon";
import { localTrustItems } from "@/data/cro";

export function LocalTrustStrip({ items = localTrustItems }: { items?: typeof localTrustItems }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="premium-surface group p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand transition duration-300 group-hover:scale-105 group-hover:border-brand/30 group-hover:bg-white">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
