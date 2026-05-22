import { ProductCard } from "@/components/commerce/product-card";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
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

  return (
    <>
      <section className="bg-white section-space">
        <div className="container-shell">
          <Breadcrumbs items={[{ label: "Products" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Badge>PrintMe catalog</Badge>
              <h1 className="mt-4 text-balance text-5xl font-black leading-tight text-ink">
                Browse print products by category, specs, timing, and order path.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate">
                Find the right product, review file requirements, compare turnaround notes, then request a quote, upload artwork, call the shop, or start a direct order where available.
              </p>
            </div>
            <TrustStrip items={["20+ years of print experience", "Quote, upload, and direct-order paths", "Pickup and delivery support"]} />
          </div>
        </div>
      </section>

      <section className="section-space bg-canvas">
        <div className="container-shell">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Shop by category</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Print service categories</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category) => (
              <a key={category.slug} href={`/products/category/${category.slug}`} className="premium-card rounded-lg border border-line bg-white p-5 shadow-soft hover:border-brand/35 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon name={category.icon} />
                </span>
                <h3 className="mt-5 text-xl font-black text-ink">{category.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{category.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Featured</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Most requested products</h2>
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
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">All services</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Complete catalog</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
