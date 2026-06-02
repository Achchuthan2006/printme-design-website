import { AccountReorderTemplate } from "@/types";
import { Button } from "@/components/ui/button";

export function ReorderStudio({
  items,
  title = "Repeat order studio",
}: {
  items: AccountReorderTemplate[];
  title?: string;
}) {
  return (
    <section className="surface-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Reorders</p>
          <h2 className="mt-2 text-2xl font-black text-ink">{title}</h2>
        </div>
        <Button href="/account/reorders" variant="secondary" className="px-4 py-2 text-xs">
          Open All
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-[1.25rem] border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-canvas px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate">
                {item.sourceType === "order" ? "Previous order" : "Previous quote"}
              </span>
              <span className="rounded-full border border-brand/15 bg-brand-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-brand">
                {item.recommendedPath === "cart" ? "Fastest via cart" : "Best via quote"}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-black text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate">{item.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="value-chip">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate">Last used: {item.lastUsed}</p>
              <Button href={item.href} className="px-4 py-2 text-xs">
                {item.recommendedPath === "cart" ? "Start Similar Order" : "Start Similar Quote"}
              </Button>
            </div>
          </article>
        ))}
        {items.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-line/90 p-5 text-sm leading-6 text-slate">
            Reorder shortcuts will appear here after the first completed order or approved quote creates a repeat-ready starting point.
          </div>
        ) : null}
      </div>
    </section>
  );
}
