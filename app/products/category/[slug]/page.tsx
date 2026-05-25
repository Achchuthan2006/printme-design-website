import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/catalog/category-hero";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getCategoryBySlug, getProductsByCategory, productCategories } from "@/data/products";

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.title,
    description: category.metaDescription,
    path: `/products/category/${category.slug}`,
  });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);
  const directOrderCount = categoryProducts.filter((product) => product.ctaMode === "direct-order").length;
  const quoteFirstCount = categoryProducts.filter((product) => product.ctaMode === "quote-first").length;
  const uploadFirstCount = categoryProducts.filter((product) => product.ctaMode === "upload-first").length;

  return (
    <>
      <CategoryHero category={category} />
      <section className="bg-white section-tight">
        <div className="container-shell grid gap-4 md:grid-cols-3">
          {[
            { label: "Direct-order options", value: String(directOrderCount), detail: "Best when the specs are clear and you want a faster checkout path." },
            { label: "Quote-first options", value: String(quoteFirstCount), detail: "Best for custom materials, bundled work, design help, or mailing support." },
            { label: "Upload-first options", value: String(uploadFirstCount), detail: "Best when the artwork is ready and you want PrintMe to review the file early." },
          ].map((item) => (
            <article key={item.label} className="premium-surface p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{item.label}</p>
              <p className="mt-3 text-3xl font-black text-ink">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-line bg-canvas section-space">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Services in this category</p>
              <h2 className="display-title mt-3 text-[2.15rem] font-black leading-[0.96]">{category.shortTitle} products</h2>
            </div>
            <Button href="/products" variant="secondary">All Products</Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card p-6">
              <p className="editorial-kicker">How to use this category</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Choose the path that matches how ready the job is.</h3>
              <div className="mt-5 space-y-3">
                {[
                  "Use direct order when the format, quantity, and timing are already clear.",
                  "Use upload-first when you want artwork reviewed before the job moves too far.",
                  "Use quote-first when stock, finishing, campaign scope, or design help still need a conversation.",
                ].map((item) => (
                  <div key={item} className="signal-card text-sm leading-6 text-slate">{item}</div>
                ))}
              </div>
            </div>
            <div className="surface-card p-6">
              <p className="editorial-kicker">Inside this family</p>
              <h3 className="mt-2 text-2xl font-black text-ink">What customers usually compare here</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {categoryProducts.map((product) => (
                  <span key={product.slug} className="value-chip">
                    {product.title}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-[1.2rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                Not sure which one matches your job? Use the quote path when the size, finish, or final use is still unclear and PrintMe can help narrow it down before the order starts.
              </div>
            </div>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
