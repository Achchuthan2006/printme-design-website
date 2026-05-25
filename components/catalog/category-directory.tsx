import Link from "next/link";
import { productCategories, getProductsByCategory } from "@/data/products";
import { Icon } from "@/components/ui/icon";

export function CategoryDirectory() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {productCategories.map((category) => {
        const count = getProductsByCategory(category.slug).length;
        return (
          <Link
            key={category.slug}
            href={`/products/category/${category.slug}`}
            className="premium-card premium-surface group p-5 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                <Icon name={category.icon} className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-line/80 bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">
                {count} {count === 1 ? "service" : "services"}
              </span>
            </div>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">{category.shortTitle}</p>
            <h3 className="mt-2 text-[1.35rem] font-black leading-[1.03] text-ink">{category.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate">{category.description}</p>
            <div className="mt-4 rounded-[1.2rem] border border-line bg-white/88 p-3 text-xs leading-5 text-slate">
              <p className="font-black text-ink">Best for</p>
              <p className="mt-1">{category.highlight}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line/75 pt-4">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Browse category</span>
              <span className="text-sm font-black text-ink">View details</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
