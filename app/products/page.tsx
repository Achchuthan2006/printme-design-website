import { ProductCard } from "@/components/commerce/product-card";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { BrandArchitecturePanel } from "@/components/catalog/brand-architecture-panel";
import { PaymentClarityPanel } from "@/components/catalog/payment-clarity-panel";
import { TimelineRulesPanel } from "@/components/catalog/timeline-rules-panel";
import { CategoryDirectory } from "@/components/catalog/category-directory";
import { FinalCta } from "@/components/catalog/final-cta";
import { TrustStrip } from "@/components/catalog/trust-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/metadata";
import { getFeaturedProducts, productCategories, products } from "@/data/products";

export const metadata = buildMetadata({
  title: "Print Products",
  description: "Browse PrintMe products including business cards, flyers, banners, document printing, passport photos, engineering drawings, cheques, and custom orders.",
  path: "/products",
});

export default function ProductsPage() {
  const featuredProducts = getFeaturedProducts();
  const catalogGuides = [
    {
      title: "Browse by product type",
      description: "Best when you already know the print format and want to compare options quickly.",
    },
    {
      title: "Use product detail pages",
      description: "Review turnaround, file requirements, pickup or delivery notes, and the safest ordering path before you commit.",
    },
    {
      title: "Switch to quote-first when needed",
      description: "If the job is custom, specialty, or uncertain, move into a guided quote request instead of forcing a direct order.",
    },
  ];
  const orderMethodSignals = [
    {
      title: "Use a ready template",
      detail: "Fastest when you want a stored layout and only light editable details.",
    },
    {
      title: "Choose a design and customize it",
      detail: "Best when you want a template direction but still need PrintMe to adapt it.",
    },
    {
      title: "Upload a finished file",
      detail: "For customers who already have final artwork and need file review plus the right specs.",
    },
    {
      title: "Request a full custom design",
      detail: "For products that still need creative work, layout help, or brand setup from scratch.",
    },
  ];

  return (
    <>
      <section className="bg-white section-space">
        <div className="container-shell">
          <Breadcrumbs items={[{ label: "Products" }]} />
          <div className="hero-panel mt-8 px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Badge>PrintMe catalog</Badge>
                <h1 className="display-title mt-4 text-balance text-[3rem] font-black leading-[0.93] sm:text-[4rem]">Simple product structure. Clear next steps.</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate">Browse by product family, compare common sizes and timing, then order, quote, or upload with less guesswork.</p>
              </div>
              <TrustStrip items={["20+ years of print experience", "Quote, upload, and direct-order paths", "Pickup and delivery support"]} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-canvas">
        <div className="container-shell">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="story-panel pl-7">
              <p className="editorial-kicker">Browse smarter</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Use the catalog to reduce guesswork.</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                Every product page should answer four things fast: what it is for, what sizes matter, how long it usually takes, and whether payment happens now or after review.
              </p>
              <div className="mt-5 space-y-3">
                {catalogGuides.map((guide) => (
                  <div key={guide.title} className="signal-card">
                    <p className="text-sm font-black text-ink">{guide.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{guide.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {productCategories.map((category) => (
                <a key={category.slug} href={`/products/category/${category.slug}`} className="premium-card premium-surface p-5 hover:border-brand/35 hover:shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/12 bg-brand-soft text-brand">
                    <Icon name={category.icon} />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-ink">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate">{category.description}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-[1.9rem] border border-line/80 bg-white p-6 shadow-soft">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="editorial-kicker">Ordering architecture</p>
                <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Every major product now follows the same guided logic.</h2>
                <p className="mt-3 text-sm leading-7 text-slate">
                  Choose the product first. Confirm the specs. Pick the right order method. Preview what you can. Then submit a clearer order, upload, or custom request for the team.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {orderMethodSignals.map((item) => (
                  <div key={item.title} className="signal-card">
                    <p className="text-sm font-black text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell">
          <div className="mb-8">
            <p className="editorial-kicker">Browse by service family</p>
            <h2 className="display-title mt-3 text-[2.15rem] font-black leading-[0.96]">A cleaner way to explore PrintMe</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
              Product families stay under one brand, but each major pillar gets a clearer landing path so signage, core print, and custom design work do not blur together.
            </p>
          </div>
          <CategoryDirectory />
          <div className="mt-8">
            <BrandArchitecturePanel />
          </div>
        </div>
      </section>

      <section className="bg-canvas section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <TimelineRulesPanel />
          <PaymentClarityPanel />
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Featured</p>
              <h2 className="display-title mt-3 text-[2.15rem] font-black leading-[0.96]">Most requested products</h2>
            </div>
            <Button href="/quote-request" variant="secondary">Need a custom quote?</Button>
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
          <CatalogExplorer products={products} categories={productCategories} featuredProducts={featuredProducts} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
