import { sizePreviewLibrary } from "@/data/experience";

function scaleBox(width: number, height: number) {
  const longestSide = Math.max(width, height);
  const scale = longestSide > 0 ? 112 / longestSide : 1;
  return {
    width: Math.max(34, Math.round(width * scale)),
    height: Math.max(26, Math.round(height * scale)),
  };
}

export function ProductSizePreview({ slug, title }: { slug: string; title: string }) {
  const sizes = sizePreviewLibrary[slug];

  if (!sizes?.length) return null;

  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Size guide</p>
      <h2 className="mt-2 text-3xl font-black text-ink">See common {title.toLowerCase()} sizes at a glance</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
        Use the visual guide below to compare common sizes quickly. Final production specs are still confirmed during review.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {sizes.map((size) => {
          const box = scaleBox(size.width, size.height);
          return (
            <article key={size.label} className="rounded-[1.35rem] border border-line bg-canvas p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-ink">{size.label}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate">{size.use}</p>
                </div>
                {size.featured ? (
                  <span className="rounded-full border border-brand/15 bg-brand-soft px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand">
                    Popular
                  </span>
                ) : null}
              </div>
              <div className="mt-6 flex h-36 items-center justify-center rounded-[1.15rem] border border-dashed border-line/90 bg-white/92">
                <div
                  className="rounded-[0.9rem] border border-brand/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(253,244,239,0.95))] shadow-[0_18px_28px_rgba(18,17,16,0.08)]"
                  style={{ width: `${box.width}px`, height: `${box.height}px` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
