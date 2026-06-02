"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { useEngagement } from "@/features/engagement/engagement-context";
import { trackPrintMeEvent } from "@/lib/analytics/client";
import { buildDiscoveryExperience, DiscoveryFilterState } from "@/lib/discovery";
import { cn } from "@/lib/utils";
import { DiscoveryFacetGroup, PrintProduct, ProductCategory } from "@/types";

const sortOptions = [
  { value: "best-match", label: "Best match" },
  { value: "popular", label: "Most popular" },
  { value: "premium", label: "Premium first" },
  { value: "fastest", label: "Fastest turnaround" },
  { value: "template-ready", label: "Template ready" },
  { value: "quote-first", label: "Quote-first work" },
  { value: "a-z", label: "A-Z" },
] as const;

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

function facetGroupToFilterKey(group: DiscoveryFacetGroup): keyof DiscoveryFilterState {
  if (group.id.includes("size")) return "size";
  if (group.id.includes("material") || group.id.includes("stock")) return "material";
  if (group.id.includes("finish")) return "finish";
  if (group.id.includes("turnaround")) return "turnaround";
  if (group.id.includes("premium")) return "premium";
  if (group.id.includes("template")) return "template";
  if (group.id.includes("quote") || group.id.includes("order-path")) return "orderPath";
  if (group.id.includes("environment")) return "environment";
  return "orderPath";
}

function FacetGroup({
  group,
  filters,
  onToggle,
}: {
  group: DiscoveryFacetGroup;
  filters: DiscoveryFilterState;
  onToggle: (group: DiscoveryFacetGroup, value: string) => void;
}) {
  const key = facetGroupToFilterKey(group);
  const activeValues = filters[key] ?? [];

  return (
    <div className="rounded-[1.25rem] border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-ink">{group.label}</p>
          {group.helpText ? <p className="mt-1 text-xs leading-5 text-slate">{group.helpText}</p> : null}
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {group.options.map((option) => {
          const active = activeValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(group, option.value)}
              className={cn(
                "flex items-center justify-between rounded-[1rem] border px-3 py-3 text-left transition",
                active ? "border-brand bg-brand-soft text-brand" : "border-line bg-canvas hover:border-brand/20",
              )}
            >
              <span className="text-sm font-black text-ink">{option.label}</span>
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate">{option.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CatalogExplorer({
  products,
  categories,
  featuredProducts,
  initialQuery = "",
  initialCategory = "all",
}: {
  products: PrintProduct[];
  categories: ProductCategory[];
  featuredProducts: PrintProduct[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const { favorites, compare, recentlyViewed, clearCompare } = useEngagement();
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("best-match");
  const [filters, setFilters] = useState<DiscoveryFilterState>({});
  const deferredQuery = useDeferredValue(query);

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

  const discovery = useMemo(
    () =>
      buildDiscoveryExperience({
        query: deferredQuery,
        categorySlug: categoryFilter === "all" ? undefined : categoryFilter,
        filters,
        sort,
      }),
    [categoryFilter, deferredQuery, filters, sort],
  );

  const activeFilterChips = useMemo(
    () =>
      Object.entries(filters).flatMap(([key, values]) =>
        (values ?? []).map((value) => ({
          key: key as keyof DiscoveryFilterState,
          value,
          label: value,
        })),
      ),
    [filters],
  );

  useEffect(() => {
    setFilters({});
  }, [categoryFilter]);

  useEffect(() => {
    const normalizedQuery = deferredQuery.trim();
    if (normalizedQuery.length < 2 && activeFilterChips.length === 0) return;

    const timeout = window.setTimeout(() => {
      trackPrintMeEvent({
        eventName: "catalog_search_used",
        pageType: "category",
        funnelName: "storefront_discovery",
        funnelStage: "search",
        isMicroConversion: true,
        properties: {
          queryLength: normalizedQuery.length,
          resultCount: discovery.products.length,
          categoryFilter,
          activeFilterCount: activeFilterChips.length,
          sort,
        },
      });
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [activeFilterChips.length, categoryFilter, deferredQuery, discovery.products.length, sort]);

  function toggleFacet(group: DiscoveryFacetGroup, value: string) {
    const key = facetGroupToFilterKey(group);
    setFilters((current) => {
      const activeValues = current[key] ?? [];
      const nextValues =
        group.type === "single"
          ? activeValues.includes(value)
            ? []
            : [value]
          : activeValues.includes(value)
            ? activeValues.filter((item) => item !== value)
            : [...activeValues, value];

      return {
        ...current,
        [key]: nextValues,
      };
    });
  }

  function removeFilterChip(key: keyof DiscoveryFilterState, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: (current[key] ?? []).filter((item) => item !== value),
    }));
  }

  return (
    <div>
      <section className="surface-card p-6">
        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="editorial-kicker">Discovery engine</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Search, refine, recover, and compare without digging through the catalog manually</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
              Search by product, material, finish, use case, or service intent. Then narrow the result with category-aware filters that reflect how print jobs are actually chosen.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr_0.9fr_0.85fr]">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, templates, services, or materials" aria-label="Search PrintMe catalog" />
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="input-base">
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number]["value"])} className="input-base">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {discovery.search.suggestions.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {discovery.search.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="value-chip"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
            {activeFilterChips.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeFilterChips.map((chip) => (
                  <button
                    key={`${chip.key}-${chip.value}`}
                    type="button"
                    onClick={() => removeFilterChip(chip.key, chip.value)}
                    className="rounded-full border border-brand/20 bg-brand-soft px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-brand"
                  >
                    {chip.label} x
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFilters({})}
                  className="text-[11px] font-black uppercase tracking-[0.16em] text-slate transition hover:text-ink"
                >
                  Clear all
                </button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="signal-card">
              <p className="text-sm font-black text-ink">Recently viewed</p>
              <p className="mt-1 text-sm leading-6 text-slate">{recentProducts.length} remembered so returning users can jump back into the right job faster.</p>
            </div>
            <div className="signal-card">
              <p className="text-sm font-black text-ink">Saved products</p>
              <p className="mt-1 text-sm leading-6 text-slate">{favoriteProducts.length} saved to revisit without restarting discovery.</p>
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
                  <div><span className="font-black text-ink">Path:</span> {product.ctaMode === "direct-order" ? "Direct order" : product.ctaMode === "upload-first" ? "Upload first" : product.ctaMode === "contact" ? "Contact first" : "Quote first"}</div>
                  <div><span className="font-black text-ink">Timing:</span> {product.turnaround}</div>
                  <div><span className="font-black text-ink">Start:</span> {product.startingPrice ? `$${product.startingPrice}` : "Quote"}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-4">
          <div className="surface-card p-5">
            <p className="editorial-kicker">Context-aware filters</p>
            <h3 className="mt-2 text-2xl font-black text-ink">Only show the filters that help this part of the catalog</h3>
            <p className="mt-3 text-sm leading-6 text-slate">
              Facets shift based on category and result set, so signs emphasize material and environment while cards and flyers emphasize size, finish, premium level, and ordering path.
            </p>
          </div>
          {discovery.facets.map((group) => (
            <FacetGroup key={group.id} group={group} filters={filters} onToggle={toggleFacet} />
          ))}
        </aside>

        <div className="space-y-6">
          {(deferredQuery.trim() || categoryFilter !== "all") && (discovery.templates.length > 0 || discovery.services.length > 0 || discovery.support.length > 0) ? (
            <section className="surface-card p-6">
              <p className="editorial-kicker">Guided discovery</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Useful matches beyond standard product cards</h3>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {discovery.templates.length > 0 ? (
                  <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
                    <p className="text-sm font-black text-ink">Templates</p>
                    <div className="mt-3 grid gap-2">
                      {discovery.templates.slice(0, 3).map((template) => (
                        <a key={template.id} href={template.href} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                          <p className="text-sm font-black text-ink">{template.title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate">{template.summary}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                {discovery.services.length > 0 ? (
                  <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
                    <p className="text-sm font-black text-ink">Services</p>
                    <div className="mt-3 grid gap-2">
                      {discovery.services.slice(0, 3).map((service) => (
                        <a key={service.slug} href={`/services/${service.slug}`} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                          <p className="text-sm font-black text-ink">{service.shortTitle}</p>
                          <p className="mt-1 text-xs leading-5 text-slate">{service.summary}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                {discovery.support.length > 0 ? (
                  <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
                    <p className="text-sm font-black text-ink">Support shortcuts</p>
                    <div className="mt-3 grid gap-2">
                      {discovery.support.slice(0, 3).map((item) => (
                        <a key={item.title} href={item.href} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                          <p className="text-sm font-black text-ink">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate">{item.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-ink">Browse results</h3>
                <p className="mt-1 text-sm leading-6 text-slate">
                  {discovery.products.length} product matches
                  {categoryFilter !== "all" ? " in this category" : ""}
                  {deferredQuery.trim() ? ` for "${deferredQuery.trim()}"` : ""}
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">{discovery.products.length} products</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {discovery.products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            {discovery.products.length === 0 ? (
              <div className="mt-6 space-y-4 rounded-[1.35rem] border border-line bg-canvas p-6">
                <div>
                  <p className="font-black text-ink">No products match the current discovery setup.</p>
                  <p className="mt-2 text-sm leading-6 text-slate">Instead of leaving the user stuck, PrintMe now suggests the closest recovery paths, broader category routes, and human-help shortcuts.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {discovery.recovery.map((item) => (
                    <a key={item.title} href={item.href} className="rounded-[1.1rem] border border-line bg-white p-4 transition hover:border-brand/20">
                      <p className="text-sm font-black text-ink">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {discovery.products.length > 0 ? (
            <section className="surface-card p-6">
              <p className="editorial-kicker">Recommendation layer</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Guide customers toward premium, template-ready, or consultation-led paths</h3>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">Premium picks</p>
                  <div className="mt-3 grid gap-2">
                    {discovery.recommendations.premium.slice(0, 3).map((product) => (
                      <a key={product.slug} href={`/products/${product.slug}`} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                        <p className="text-sm font-black text-ink">{product.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate">{product.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">Template-ready</p>
                  <div className="mt-3 grid gap-2">
                    {discovery.recommendations.templateReady.slice(0, 3).map((product) => (
                      <a key={product.slug} href={`/products/${product.slug}#interactive-preview`} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                        <p className="text-sm font-black text-ink">{product.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate">{product.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">Consultative routes</p>
                  <div className="mt-3 grid gap-2">
                    {discovery.recommendations.supportLinks.slice(0, 3).map((item) => (
                      <a key={item.title} href={item.href} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                        <p className="text-sm font-black text-ink">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate">{item.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
