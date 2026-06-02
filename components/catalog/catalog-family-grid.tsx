import Link from "next/link";
import { ProductCategory } from "@/types";

export function CatalogFamilyGrid({ categories }: { categories: ProductCategory[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Link key={category.slug} href={`/products/category/${category.slug}`} className="premium-surface p-5 transition hover:border-brand/25 hover:shadow-card">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">{category.shortTitle}</p>
          <h3 className="mt-3 text-xl font-black text-ink">{category.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
