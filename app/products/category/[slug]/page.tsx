import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/catalog/category-hero";
import { JourneyBridge } from "@/components/analytics/journey-bridge";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductCard } from "@/components/commerce/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getDiscoveryFacetGroups, getDiscoveryRecommendations } from "@/lib/discovery";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo";
import { getPricingRule } from "@/lib/pricing";
import { getCategoryBySlug, getProductsByCategory, productCategories } from "@/data/products";
import { catalogUtilityLinks, getCatalogNavigationFamilies, getCategoryPreviewProducts, getRelatedServicesForCategory } from "@/data/catalog";
import Link from "next/link";

function getCategoryPriceSummary(productSlugs: ReturnType<typeof getProductsByCategory>) {
  if (productSlugs.length === 0) {
    return { label: "Custom quote", detail: "Pricing is confirmed through review." };
  }

  const minimum = Math.min(
    ...productSlugs.map((product) => product.startingPrice ?? getPricingRule(product).minimumCharge).filter((value) => value > 0),
  );
  const instantCount = productSlugs.filter((product) => getPricingRule(product).behavior === "instant").length;

  return instantCount > 0
    ? {
        label: `From $${minimum}`,
        detail: `${instantCount} product ${instantCount === 1 ? "path has" : "paths have"} standard listed pricing.`,
      }
    : {
        label: `Quote from $${minimum}`,
        detail: "Most products in this family need review before final pricing is confirmed.",
      };
}

function getCategoryOptionLabels(products: ReturnType<typeof getProductsByCategory>) {
  return Array.from(
    new Set(
      products.flatMap((product) =>
        product.options
          .filter((option) => option.type !== "textarea" && (option.choices?.length ?? 0) > 0)
          .map((option) => option.label),
      ),
    ),
  ).slice(0, 4);
}

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
    keywords: [category.title.toLowerCase(), `${category.shortTitle.toLowerCase()} printing`, "scarborough print services"],
  });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const navigationCategory = getCatalogNavigationFamilies().find((item) => item.slug === category.slug) ?? category;

  const categoryProducts = getProductsByCategory(category.slug);
  const previewProducts = getCategoryPreviewProducts(category);
  const relatedServices = getRelatedServicesForCategory(category);
  const groupedPathCount = navigationCategory.subcategoryGroups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
  const discoveryFacets = getDiscoveryFacetGroups(categoryProducts, category.slug).slice(0, 4);
  const discoveryRecommendations = getDiscoveryRecommendations(categoryProducts, category);
  const priceSummary = getCategoryPriceSummary(categoryProducts);
  const optionLabels = getCategoryOptionLabels(categoryProducts);
  const instantReadyCount = categoryProducts.filter((product) => product.mode !== "quote-only").length;
  const quoteFirstCount = categoryProducts.filter((product) => product.ctaMode === "quote-first" || product.mode === "quote-only").length;
  const buyerAnswers = [
    {
      question: "What is in this category?",
      answer: category.title,
      detail: category.highlight,
    },
    {
      question: "What are the standard options?",
      answer: optionLabels.length > 0 ? optionLabels.join(" / ") : "Custom review",
      detail: optionLabels.length > 0 ? "These are the main option groups buyers compare first." : "Most products here are configured through quote review instead of fixed menus.",
    },
    {
      question: "How much does it cost?",
      answer: priceSummary.label,
      detail: priceSummary.detail,
    },
    {
      question: "How fast can I get it?",
      answer: category.turnaroundNote,
      detail: "Rush timing still depends on file readiness, quantity, and live production capacity.",
    },
    {
      question: "Order now or request a quote?",
      answer: instantReadyCount > 0 ? `${instantReadyCount} orderable, ${quoteFirstCount} quote-first` : `${quoteFirstCount} quote-first paths`,
      detail: "Category cards below show which products can move straight into checkout and which ones need review first.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { label: "Products", href: "/products" },
            { label: category.title },
          ]),
          buildCollectionPageSchema({
            name: category.title,
            description: category.description,
            path: `/products/category/${category.slug}`,
            items: previewProducts.map((product) => ({
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
          categorySlug: category.slug,
          productCount: categoryProducts.length,
          groupedPathCount,
        }}
      />

      <CategoryHero category={navigationCategory} />

      <section className="bg-white section-tight">
        <div className="container-shell">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Fast buying answers</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Scan this category like a storefront, not a brochure page.</h2>
            </div>
            <Button href="/quote-request" variant="secondary">Need a custom path?</Button>
          </div>
          <div className="grid gap-4 xl:grid-cols-5">
            {buyerAnswers.map((item) => (
              <article key={item.question} className="premium-surface p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate">{item.question}</p>
                <p className="mt-3 text-sm font-black leading-6 text-ink">{item.answer}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { label: "Visible product paths", value: String(groupedPathCount || categoryProducts.length), detail: "Grouped product, support, and quote paths shown directly inside this category hub." },
              { label: "Dedicated product pages", value: String(categoryProducts.length), detail: "Important products already have their own detail pages for specs, order flow, and related options." },
              { label: "Custom service support", value: String((category.supportLinks?.length ?? 0) + (category.featuredLinks?.length ?? 0)), detail: "Quote-first, design-first, and help-first shortcuts keep complex jobs visible." },
            ].map((item) => (
              <article key={item.label} className="premium-surface p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{item.label}</p>
                <p className="mt-3 text-3xl font-black text-ink">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {previewProducts.length > 0 ? (
        <section className="bg-white section-space">
          <div className="container-shell">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="editorial-kicker">Shop the family</p>
                <h2 className="display-title mt-3 text-[2.15rem] font-black leading-[0.96]">Standard products, exposed specs, and clear quote-first paths</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                  Each card shows the practical buying signals first: standard options, starting price, timing, and whether the job can move straight into checkout.
                </p>
              </div>
              <Button href="/products" variant="secondary">Browse all products</Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {previewProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {navigationCategory.subcategoryGroups?.length ? (
        <section className="border-y border-line bg-canvas section-space">
          <div className="container-shell">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="editorial-kicker">Grouped browse paths</p>
                <h2 className="display-title mt-3 text-[2.15rem] font-black leading-[0.96]">{category.title} product map</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                  Start with the most commercially clear path: standard products, premium formats, support shortcuts, or custom quote entries.
                </p>
              </div>
              <Button href="/quote-request" variant="secondary">Need guidance first?</Button>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {navigationCategory.subcategoryGroups.map((group) => (
                <div key={group.title} className="surface-card p-6">
                  <p className="editorial-kicker">{group.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate">{group.description}</p>
                  <div className="mt-5 grid gap-3">
                    {group.items.map((item) => (
                      <Link key={item.title} href={item.href} className="rounded-[1.25rem] border border-line/70 bg-canvas/70 p-4 transition hover:border-brand/20 hover:bg-white">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-ink">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
                          </div>
                          {item.badge ? <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">{item.badge}</span> : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {discoveryFacets.length > 0 ? (
        <section className="border-y border-line bg-canvas section-space">
          <div className="container-shell grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Category-aware discovery</p>
              <h2 className="mt-2 text-3xl font-black text-ink">How customers narrow {category.shortTitle.toLowerCase()} without getting lost</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                These filters reflect real buying decisions instead of generic brochure sorting, so customers can move toward the right standard product or quote path faster.
              </p>
              <div className="mt-5 grid gap-3">
                {discoveryFacets.map((facet) => (
                  <div key={facet.id} className="rounded-[1.2rem] border border-line bg-canvas p-4">
                    <p className="text-sm font-black text-ink">{facet.label}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {facet.options.slice(0, 4).map((option) => (
                        <span key={option.value} className="value-chip">
                          {option.label} ({option.count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Button href={`/products?category=${category.slug}`}>Open Guided Discovery</Button>
              </div>
            </div>
            <div className="surface-card p-6">
              <p className="editorial-kicker">Recommended next paths</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Keep standard, premium, and support routes visible together</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">Premium or strategic picks</p>
                  <div className="mt-3 grid gap-2">
                    {discoveryRecommendations.premium.slice(0, 3).map((product) => (
                      <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                        <p className="text-sm font-black text-ink">{product.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate">{product.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">Template or support paths</p>
                  <div className="mt-3 grid gap-2">
                    {discoveryRecommendations.supportLinks.slice(0, 3).map((item) => (
                      <Link key={item.title} href={item.href} className="rounded-[1rem] border border-line/70 bg-white px-3 py-3 transition hover:border-brand/20">
                        <p className="text-sm font-black text-ink">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-canvas section-space">
        <div className="container-shell grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="surface-card p-6">
            <p className="editorial-kicker">Featured paths</p>
            <h2 className="mt-2 text-3xl font-black text-ink">The fastest routes customers usually need first</h2>
            <div className="mt-5 grid gap-3">
              {[...(category.featuredLinks ?? []), ...(category.supportLinks ?? [])].map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[1.25rem] border border-line/70 bg-canvas/70 p-4 transition hover:border-brand/20 hover:bg-white">
                  <p className="text-sm font-black text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="surface-card p-6">
            <p className="editorial-kicker">Support and related services</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Keep custom, design, and rush help visible from inside the category.</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {relatedServices.map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`} className="rounded-[1.25rem] border border-line/70 bg-canvas/70 p-4 transition hover:border-brand/20 hover:bg-white">
                  <p className="text-sm font-black text-ink">{service.shortTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{service.summary}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {catalogUtilityLinks.slice(0, 4).map((item) => (
                <Link key={item.title} href={item.href} className="value-chip">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
