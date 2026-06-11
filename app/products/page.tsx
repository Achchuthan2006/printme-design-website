import { ProductCard } from "@/components/commerce/product-card";
import { JourneyBridge } from "@/components/analytics/journey-bridge";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { FinalCta } from "@/components/catalog/final-cta";
import { TrustStrip } from "@/components/catalog/trust-strip";
import { CatalogFamilyGrid } from "@/components/catalog/catalog-family-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo";
import { catalogProductPages, productCategories, getFeaturedProducts } from "@/data/products";
import { catalogUtilityLinks, featuredCatalogCollections, industryPaths } from "@/data/catalog";

export const metadata = buildMetadata({
  title: "Print Products",
  description: "Explore PrintMe's full large-format, stationery, packaging, marketing, document, custom, design, apparel, and promotional print catalog.",
  path: "/products",
  keywords: [
    "print catalog scarborough",
    "large catalog print products",
    "business cards brochures packaging apparel",
    "custom printing scarborough toronto",
  ],
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const params = await searchParams;
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([{ label: "Products" }]),
          buildCollectionPageSchema({
            name: "Print Products",
            description: "Product family hubs and detailed print product pages across the PrintMe catalog.",
            path: "/products",
            items: catalogProductPages.map((product) => ({
              name: product.title,
              path: `/products/${product.slug}`,
            })),
          }),
        ]}
      />
      <JourneyBridge
        eventName="category_viewed"
        pageType="category"
        funnelName="storefront_discovery"
        funnelStage="category"
        journey="storefront_discovery"
        isMicroConversion
        properties={{
          categorySlug: "catalog-root",
          featuredProductCount: featuredProducts.length,
          categoryCount: productCategories.length,
        }}
      />

      <section className="bg-white section-space">
        <div className="container-shell">
          <Breadcrumbs items={[{ label: "Products" }]} />
          <div className="hero-panel mt-8 px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Badge>Print storefront</Badge>
                <h1 className="display-title mt-4 text-balance text-[3rem] font-black leading-[0.92] sm:text-[4.5rem]">
                  Find the right print product, then order or quote it with confidence.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate">
                  Browse product families, compare bestsellers, and move into direct order or quote-first paths without guessing how PrintMe wants the job submitted.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button href="/quote-request">Request a Custom Quote</Button>
                  <Button href="/account/reorders" variant="secondary">Open Reorders</Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  "See standard sizes, options, and price-from cues earlier",
                  "Know when a job can go straight to checkout",
                  "Switch to quote-first when the specs go custom",
                  "Keep upload, support, and reorder paths close by",
                ].map((item) => (
                  <div key={item} className="signal-card p-4 text-sm leading-6 text-slate">
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <TrustStrip items={["Price cues and quote logic shown earlier", "Scarborough pickup and delivery guidance", "Upload, proof, and support paths tied to the same order flow"]} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-canvas">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Catalog families</p>
              <h2 className="display-title mt-3 text-[2.35rem] font-black leading-[0.96]">Start with the product family that matches the job.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                Every major print family leads into clearer category pages, stronger product cards, and the right order-vs-quote path for the work.
              </p>
            </div>
            <Button href="/quote-request?service=White-Glove%20Project%20Intake" variant="secondary">Need a complex project quoted?</Button>
          </div>
          <CatalogFamilyGrid categories={productCategories} />
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Multiple discovery paths</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Start from the product, the use case, or the support question.</h2>
              <div className="mt-5 grid gap-3">
                {[
                "Browse by product family when you already know the format.",
                "Use industry paths when you know the campaign or business use first.",
                "Use quote, rush, design, or custom-order shortcuts when the job still needs review.",
                ].map((item) => (
                  <div key={item} className="signal-card p-4 text-sm leading-6 text-slate">
                    {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {industryPaths.map((path) => (
              <a key={path.slug} href={path.href} className="premium-surface p-5 transition hover:border-brand/25 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                  <Icon name={path.icon} className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-5 text-lg font-black text-ink">{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{path.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Fast shortcuts</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Keep high-intent actions one click away.</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {catalogUtilityLinks.map((item) => (
                <a key={item.title} href={item.href} className="rounded-[1.25rem] border border-line/70 bg-canvas/75 p-4 transition hover:border-brand/20 hover:bg-white">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
                      <Icon name={item.icon} className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-ink">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate">{item.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
            <div className="surface-card p-6">
              <p className="editorial-kicker">Featured collections</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Browse common multi-product jobs without getting lost.</h2>
            <div className="mt-5 grid gap-3">
              {featuredCatalogCollections.map((item) => (
                <a key={item.title} href={item.href} className="rounded-[1.25rem] border border-line/70 bg-canvas/75 p-4 transition hover:border-brand/20 hover:bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-ink">{item.title}</p>
                    {item.badge ? <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">{item.badge}</span> : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Best sellers</p>
              <h2 className="display-title mt-3 text-[2.15rem] font-black leading-[0.96]">Start with the products customers ask for most.</h2>
            </div>
            <Button href="/quote-request" variant="secondary">Need something more custom?</Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-canvas">
        <div className="container-shell">
          <CatalogExplorer
            products={catalogProductPages}
            categories={productCategories}
            initialQuery={params.query ?? ""}
            initialCategory={params.category ?? "all"}
          />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
