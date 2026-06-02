import Link from "next/link";
import { productCategories, getProductsByCategory } from "@/data/products";
import { Icon } from "@/components/ui/icon";

export function CategoryDirectory() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {productCategories.map((category) => {
        const count = getProductsByCategory(category.slug).length;
        const subcategoryCount = category.subcategoryGroups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
        return (
          <Link
            key={category.slug}
            href={`/products/category/${category.slug}`}
            className="premium-card group overflow-hidden rounded-[1.85rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(252,248,242,0.9))] p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/18 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-line/70 bg-canvas text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <Icon name={category.icon} className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-line/80 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">
                {category.productCountLabel ?? `${Math.max(count, subcategoryCount)} paths`}
              </span>
            </div>
            <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate">{category.shortTitle}</p>
            <h3 className="mt-2 font-display text-[1.62rem] leading-[1.02] text-ink">{category.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate">{category.description}</p>
            <div className="mt-5 rounded-[1.25rem] border border-line bg-canvas/55 p-4 text-xs leading-5 text-slate">
              <p className="font-black text-ink">Best for</p>
              <p className="mt-1">{category.highlight}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.trustNotes.slice(0, 2).map((note) => (
                <span key={note} className="value-chip">
                  {note}
                </span>
              ))}
            </div>
            {category.subcategoryGroups?.length ? (
              <div className="mt-4 rounded-[1.25rem] border border-line bg-white p-3 text-xs leading-5 text-slate">
                <span className="font-black text-ink">{subcategoryCount}</span> deeper product and service paths across {category.subcategoryGroups.length} grouped browse sections.
              </div>
            ) : null}
            <div className="mt-6 flex items-center justify-between border-t border-line/75 pt-4">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Browse category</span>
              <span className="text-sm font-black text-ink">Open family</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
