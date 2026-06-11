import { notFound } from "next/navigation";
import { PaymentClarityPanel } from "@/components/catalog/payment-clarity-panel";
import { InteractiveProductExperience } from "@/components/catalog/interactive-product-experience";
import { ProductSizePreview } from "@/components/catalog/product-size-preview";
import { ProductConfigurator } from "@/components/commerce/product-configurator";
import { TimelineRulesPanel } from "@/components/catalog/timeline-rules-panel";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { FaqAccordion } from "@/components/catalog/faq-accordion";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductEngagementActions } from "@/components/catalog/product-engagement-actions";
import { ProductPageBridge } from "@/components/catalog/product-page-bridge";
import { ProductActions } from "@/components/catalog/product-actions";
import { ProductBuyingAnswers, ProductOptionOverview } from "@/components/catalog/product-buying-blocks";
import { RelatedServices } from "@/components/catalog/related-services";
import { JsonLd } from "@/components/seo/json-ld";
import { SpecList } from "@/components/catalog/spec-list";
import { TrustStrip } from "@/components/catalog/trust-strip";
import { LocalTrustStrip } from "@/components/conversion/local-trust-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { PrintReadyChecklist } from "@/components/upload/print-ready-checklist";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductSchema } from "@/lib/seo";
import { defaultPricingRule, pricingRules } from "@/data/pricing-rules";
import { catalogProductPages, getCategoryBySlug, getProductBySlug, getRelatedProducts } from "@/data/products";
import { getServicePageHrefByServiceSlug } from "@/data/services";

export function generateStaticParams() {
  return catalogProductPages.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${product.slug}`,
    keywords: [product.title.toLowerCase(), `${product.title.toLowerCase()} scarborough`, `${product.title.toLowerCase()} toronto`],
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = getRelatedProducts(product.related);
  const pricingRule = pricingRules[product.slug] ?? defaultPricingRule;
  const faqSchema = buildFaqSchema(product.faqs);
  const serviceHref = getServicePageHrefByServiceSlug(product.slug);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { label: "Products", href: "/products" },
            ...(category ? [{ label: category.title, href: `/products/category/${category.slug}` }] : []),
            { label: product.title },
          ]),
          buildProductSchema(product, category, `/products/${product.slug}`),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />
      <ProductPageBridge slug={product.slug} categorySlug={product.categorySlug} />
      <section className="relative overflow-hidden bg-white section-space">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.10),transparent_28rem),radial-gradient(circle_at_86%_14%,rgba(31,27,24,0.05),transparent_24rem)]" aria-hidden="true" />
        <div className="container-shell relative">
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              ...(category ? [{ label: category.title, href: `/products/category/${category.slug}` }] : []),
              { label: product.title },
            ]}
          />
          <div className="hero-panel mt-8 px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="editorial-kicker">{product.productLine ?? product.category}</p>
                <h1 className="display-title mt-4 text-balance text-[3rem] font-black leading-[0.92] sm:text-[4.3rem]">{product.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate">{product.description}</p>
                <p className="mt-4 max-w-2xl rounded-[1.4rem] border border-brand/15 bg-brand-soft px-4 py-3 text-sm font-bold leading-6 text-brand">
                  PrintMe reviews files, timing, and specs before production. Payment only happens on the path that matches the job.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.badges?.map((badge) => <Badge key={badge}>{badge}</Badge>)}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ProductActions product={product} />
                </div>
                <div className="mt-4">
                  <ProductEngagementActions slug={product.slug} />
                </div>
                <ProductBuyingAnswers product={product} className="mt-6" />
              </div>
              <ServiceProductVisual slug={product.slug} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-canvas section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Buy this product</p>
              <h2 className="mt-2 text-3xl font-black text-ink">See the standard setup before you decide whether to order or request a quote.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                Start with the listed standard options here. If your quantity, size, finishing, timing, or artwork falls outside these lanes, PrintMe shifts you into the quote path instead of showing a fake price.
              </p>
              <ProductOptionOverview product={product} className="mt-6" />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Standard price path</p>
                <p className="mt-3 text-3xl font-black text-ink">
                  {pricingRule.behavior === "instant" ? `From $${pricingRule.minimumCharge}` : pricingRule.behavior === "estimate" ? `Est. $${pricingRule.minimumCharge}+` : "Custom quote"}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate">
                  {pricingRule.behavior === "instant"
                    ? "Listed combinations can price immediately."
                    : pricingRule.behavior === "estimate"
                      ? "You get a structured estimate before anything unusual moves to review."
                      : "This product needs staff review before price is locked in."}
                </p>
              </article>
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Fastest useful timing</p>
                <p className="mt-3 text-sm font-bold leading-6 text-ink">{product.turnaround}</p>
                <p className="mt-2 text-xs leading-5 text-slate">{product.rushNote ?? "Rush and same-day requests are reviewed against file readiness and live production capacity."}</p>
              </article>
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Best next step</p>
                <p className="mt-3 text-sm font-bold leading-6 text-ink">
                  {product.ctaMode === "direct-order"
                    ? "Direct order online"
                    : product.ctaMode === "upload-first"
                      ? "Upload details or order with file review"
                      : product.ctaMode === "contact"
                        ? "Call or visit the shop"
                        : "Quote-first review"}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate">
                  {pricingRule.behavior === "instant"
                    ? "Standard configurations can usually move into checkout."
                    : pricingRule.behavior === "estimate"
                      ? "Pricing starts as an estimate and may still need staff confirmation."
                      : "Manual review protects pricing accuracy and margin on this job."}
                </p>
              </article>
            </div>
            <TrustStrip items={["Local Scarborough pickup", "Clear file guidance", "Quote support for custom specs"]} />
            <LocalTrustStrip />
          </div>
          <div id="order-builder" className="lg:sticky lg:top-24 lg:self-start">
            <ProductConfigurator product={product} />
          </div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card p-6">
            <p className="editorial-kicker">What you can order</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Everything you need to decide before you order.</h2>
            <p className="mt-4 text-sm leading-7 text-slate">{product.overview}</p>
            <div className="mt-6 grid gap-3">
              {product.idealFor.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[1.2rem] border border-line bg-canvas p-3">
                  <Icon name="check" className="h-4 w-4 text-brand" />
                  <p className="text-sm font-bold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SpecList title="Standard specs" items={product.specs} />
              <SpecList title="Artwork requirements" items={product.fileRequirements} icon="document" muted />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Turnaround</p>
                <p className="mt-3 text-sm font-bold leading-6 text-ink">{product.turnaround}</p>
              </article>
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Rush policy</p>
                <p className="mt-3 text-sm font-bold leading-6 text-ink">{product.rushNote ?? "Rush timing is reviewed after artwork, quantity, and finishing are confirmed."}</p>
              </article>
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Pickup or delivery</p>
                <p className="mt-3 text-sm font-bold leading-6 text-ink">{product.pickupDeliveryNote}</p>
              </article>
            </div>
          </div>
        </div>
        <div className="container-shell mt-8">
          <PrintReadyChecklist compact />
        </div>
        <div className="container-shell mt-8">
          <InteractiveProductExperience product={product} />
        </div>
        <div className="container-shell mt-8">
          <ProductSizePreview slug={product.slug} title={product.title} />
        </div>
        {serviceHref ? (
          <div className="container-shell mt-8">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Need the service path?</p>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="mt-2 text-3xl font-black text-ink">Open the matching service page when the job still needs review.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                    This product page is for choosing specs and placing an order. Use the service page if stock, finish, timing, or use-case fit still needs a conversation first.
                  </p>
                </div>
                <Button href={serviceHref} variant="secondary">Open Service Page</Button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="border-y border-line bg-canvas section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <TimelineRulesPanel />
          <PaymentClarityPanel />
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell">
          <FaqAccordion items={product.faqs} title={`${product.title} FAQ`} />
        </div>
      </section>

      <RelatedServices products={related} title="Related services and smart next options" />
      <FinalCta product={product} />
    </>
  );
}
