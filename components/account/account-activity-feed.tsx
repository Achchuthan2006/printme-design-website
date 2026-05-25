import { AccountActivityItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const toneStyles: Record<string, string> = {
  default: "border-line/90 bg-canvas text-slate",
  attention: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const entityIcons: Record<AccountActivityItem["entityType"], string> = {
  order: "bag",
  quote: "document",
  file: "upload",
  invoice: "card",
  support: "chat",
};

export function AccountActivityFeed({
  items,
  title = "Recent account activity",
}: {
  items: AccountActivityItem[];
  title?: string;
}) {
  return (
    <section className="surface-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Activity</p>
          <h2 className="mt-2 text-2xl font-black text-ink">{title}</h2>
        </div>
        <Button href="/support" variant="secondary" className="px-4 py-2 text-xs">
          Need Help?
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={cn("rounded-[1.25rem] border px-4 py-4", toneStyles[item.tone ?? "default"])}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-brand">
                <Icon name={entityIcons[item.entityType]} className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-current/90">{item.detail}</p>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-current/70">{item.date}</span>
                </div>
                <Button href={item.href} variant="secondary" className="mt-4 px-4 py-2 text-xs">
                  Open
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
