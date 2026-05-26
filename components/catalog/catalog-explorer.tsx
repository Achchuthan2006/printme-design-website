"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { useEngagement } from "@/features/engagement/engagement-context";
import { getTemplatesForProduct } from "@/data/templates";
import { PrintProduct, ProductCategory } from "@/types";

function ProductRow({ title, products }: { title: string; products: PrintProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-black text-ink">{title}</h3>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">{products.length} products</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

export function CatalogExplorer({
  products,
  categories,
  featuredProducts,
}: {
  products: PrintProduct[];
  categories: ProductCategory[];
  featuredProducts: PrintProduct[];
}) {
  const { favorites, compare, recentlyViewed, clearCompare } = useEngagement();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [sort, setSort] = useState("recommended");

  const favoriteProducts = useMemo(
    () => favorites.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as PrintProduct[],
    [favorites, products],
  );
  const comparedProducts = useMemo(
    () => compare.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as PrintProduct[],
    [compare, products],
  );
  const recentProducts = useMemo(
    () => recentlyViewed.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as PrintProduct[],
    [products, recentlyViewed],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);
      const matchesCategory = categoryFilter === "all" || product.categorySlug === categoryFilter;
      const matchesMode =
        modeFilter === "all" ||
        (modeFilter === "template-ready" ? getTemplatesForProduct(product.slug).length > 0 : product.ctaMode === modeFilter || product.mode === modeFilter);
      return matchesQuery && matchesCategory && matchesMode;
    });

    if (sort === "a-z") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "price") {
      return [...filtered].sort((a, b) => (a.startingPrice ?? Number.MAX_SAFE_INTEGER) - (b.startingPrice ?? Number.MAX_SAFE_INTEGER));
    }

    return [...filtered].sort((a, b) => {
      const aFeatured = featuredProducts.some((product) => product.slug === a.slug) ? 1 : 0;
      const bFeatured = featuredProducts.some((product) => product.slug === b.slug) ? 1 : 0;
      return bFeatured - aFeatured;
    });
  }, [categoryFilter, featuredProducts, modeFilter, products, query, sort]);

  return (
    <div>
      <section className="surface-card p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="editorial-kicker">Find the right product faster</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Search, filter, save, and compare without losing the clean flow</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
              Use search when you know the item, filters when you know the job type, and saved/compare tools when you are still narrowing things down.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or services" aria-label="Search products" />
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="input-base">
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
              <select value={modeFilter} onChange={(event) => setModeFilter(event.target.value)} className="input-base">
                <option value="all">All order paths</option>
                <option value="direct-order">Direct order</option>
                <option value="quote-first">Quote first</option>
                <option value="upload-first">Upload first</option>
                <option value="template-ready">Template ready</option>
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="input-base">
                <option value="recommended">Recommended first</option>
                <option value="a-z">A-Z</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="signal-card">
              <p className="text-sm font-black text-ink">Recently viewed</p>
              <p className="mt-1 text-sm leading-6 text-slate">{recentProducts.length} remembered so returning users can jump back in.</p>
            </div>
            <div className="signal-card">
              <p className="text-sm font-black text-ink">Saved products</p>
              <p className="mt-1 text-sm leading-6 text-slate">{favoriteProducts.length} saved to revisit later without starting over.</p>
            </div>
            <div className="signal-card">
              <p className="text-sm font-black text-ink">Compare tray</p>
              <p className="mt-1 text-sm leading-6 text-slate">{comparedProducts.length} products ready for side-by-side review.</p>
            </div>
          </div>
        </div>
      </section>

      <ProductRow title="Recently viewed" products={recentProducts.slice(0, 3)} />
      <ProductRow title="Saved for later" products={favoriteProducts.slice(0, 3)} />

      {comparedProducts.length > 0 ? (
        <section className="mt-10 surface-card p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Comparison mode</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Compare your current shortlist</h3>
            </div>
            <Button type="button" variant="secondary" onClick={clearCompare}>
              Clear Compare
            </Button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {comparedProducts.map((product) => (
              <article key={product.slug} className="rounded-[1.35rem] border border-line bg-canvas p-4">
                <p className="text-lg font-black text-ink">{product.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{product.description}</p>
                <div className="mt-4 grid gap-2 text-xs leading-5 text-slate">
                  <div><span className="font-black text-ink">Path:</span> {product.mode === "direct-order" ? "Direct order" : product.mode === "hybrid" ? "Order or quote" : "Quote first"}</div>
                  <div><span className="font-black text-ink">Timing:</span> {product.turnaround}</div>
                  <div><span className="font-black text-ink">Start:</span> {product.startingPrice ? `$${product.startingPrice}` : "Quote"}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-2xl font-black text-ink">Browse results</h3>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">{visibleProducts.length} products</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {visibleProducts.length === 0 ? (
          <div className="mt-6 rounded-[1.35rem] border border-line bg-canvas p-6 text-sm leading-6 text-slate">
            <p className="font-black text-ink">No products match the current filters.</p>
            <p className="mt-2">Try a broader category, remove a filter, or open the quote path if the job is more custom than standard.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
