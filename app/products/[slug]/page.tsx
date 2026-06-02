import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { PaymentClarityPanel } from "@/components/catalog/payment-clarity-panel";
import { AiDesignStarter } from "@/components/ai/ai-design-starter";
import { FileReadinessAssistant } from "@/components/ai/file-readiness-assistant";
import { IntelligentOrderPath } from "@/components/ai/intelligent-order-path";
import { SmartProductRecommendations } from "@/components/ai/smart-product-recommendations";
import { SmartTemplateRecommendations } from "@/components/ai/smart-template-recommendations";
import { ContextualHelpPanel } from "@/components/support/contextual-help-panel";
import { InteractiveProductExperience } from "@/components/catalog/interactive-product-experience";
import { ProductSizePreview } from "@/components/catalog/product-size-preview";
import { ProductConfigurator } from "@/components/commerce/product-configurator";
import { TimelineRulesPanel } from "@/components/catalog/timeline-rules-panel";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { FaqAccordion } from "@/components/catalog/faq-accordion";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductDecisionTools } from "@/components/catalog/product-decision-tools";
import { ProductEngagementActions } from "@/components/catalog/product-engagement-actions";
import { ProductPageBridge } from "@/components/catalog/product-page-bridge";
import { ProductPricingSystemPanel } from "@/components/catalog/product-pricing-system-panel";
import { ProductActions } from "@/components/catalog/product-actions";
import { RelatedServices } from "@/components/catalog/related-services";
import { JsonLd } from "@/components/seo/json-ld";
import { SpecList } from "@/components/catalog/spec-list";
import { ServiceSupportPanel } from "@/components/catalog/service-support-panel";
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

const ProductOrderStudio = dynamic(
  () => import("@/components/catalog/product-order-studio").then((module) => module.ProductOrderStudio),
  {
    loading: () => <div className="surface-card h-80 animate-pulse p-6" />,
  },
);

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
  const highlightedOptions = product.options
    .filter((option) => option.choices && option.choices.length > 1)
    .slice(0, 3);
  const pricingRule = pricingRules[product.slug] ?? defaultPricingRule;
  const faqSchema = buildFaqSchema(product.faqs);
  const serviceHref = getServicePageHrefByServiceSlug(product.slug);
  const supportPathCopy =
    product.ctaMode === "direct-order"
      ? "Best when the size, quantity, and basic finish are already clear and you want the fastest route into cart."
      : product.ctaMode === "upload-first"
        ? "Best when the artwork is ready and you want PrintMe to review the file early before the job moves forward."
        : product.ctaMode === "contact"
          ? "Best when this is mainly an in-store or call-first service and timing or requirements should be confirmed directly."
          : "Best when this job still needs advice on specs, stock, finish, delivery, mailing, or design support before production.";
  const serviceFitGuides = [
    {
      title: "Best for",
      detail: `Customers who need ${product.idealFor.slice(0, 3).join(", ").toLowerCase()}.`,
    },
    {
      title: "Most useful when",
      detail: product.overview,
    },
    {
      title: "Safest next step",
      detail: supportPathCopy,
    },
  ];

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
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {serviceFitGuides.map((item) => (
                    <div key={item.title} className="rounded-[1.2rem] border border-line/80 bg-canvas/75 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <ServiceProductVisual slug={product.slug} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-canvas section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <TrustStrip items={["Local Scarborough pickup", "Clear file guidance", "Quote support for custom specs"]} />
            <LocalTrustStrip />
            <div className="grid gap-5 md:grid-cols-3">
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Pricing path</p>
                <p className="mt-3 text-3xl font-black text-ink">
                  {pricingRule.behavior === "instant" ? `From $${pricingRule.minimumCharge}` : pricingRule.behavior === "estimate" ? `Est. $${pricingRule.minimumCharge}+` : "Custom quote"}
                </p>
              </article>
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Turnaround</p>
                <p className="mt-3 text-sm font-bold leading-6 text-ink">{product.turnaround}</p>
              </article>
              <article className="premium-surface p-5">
                <p className="text-sm font-bold text-slate">Order path</p>
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
          </div>
          <div id="order-builder" className="lg:sticky lg:top-24 lg:self-start">
            <ProductConfigurator product={product} />
          </div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="editorial-kicker">Overview</p>
            <h2 className="mt-2 text-3xl font-black text-ink">What this service is for</h2>
            <p className="mt-5 text-sm leading-7 text-slate">{product.overview}</p>
            <div className="mt-6 grid gap-3">
              {product.idealFor.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[1.2rem] border border-line bg-canvas p-3">
                  <Icon name="check" className="h-4 w-4 text-brand" />
                  <p className="text-sm font-bold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <SpecList title="Specifications and options" items={product.specs} />
            <SpecList title="Artwork requirements" items={product.fileRequirements} icon="document" muted />
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
        <div className="container-shell mt-8">
          <ProductDecisionTools product={product} />
        </div>
        <div className="container-shell mt-8 grid gap-8 xl:grid-cols-2">
          <IntelligentOrderPath product={product} />
          <FileReadinessAssistant product={product} />
        </div>
        <div className="container-shell mt-8">
          <ContextualHelpPanel context="product" title={`Support for choosing the right ${product.title.toLowerCase()} path`} />
        </div>
        <div className="container-shell mt-8">
          <SmartTemplateRecommendations product={product} />
        </div>
        <div className="container-shell mt-8">
          <AiDesignStarter product={product} />
        </div>
        <div className="container-shell mt-8">
          <SmartProductRecommendations product={product} />
        </div>
        <div className="container-shell mt-8">
          <ProductPricingSystemPanel product={product} />
        </div>
        {serviceHref ? (
          <div className="container-shell mt-8">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Need guidance first?</p>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="mt-2 text-3xl font-black text-ink">Use the matching service page when the job still needs a conversation.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                    This product page is built for specifications and ordering. The service page is better when stock, finish, timing, or use-case fit still needs advice before you lock the job in.
                  </p>
                </div>
                <Button href={serviceHref} variant="secondary">Open Service Page</Button>
              </div>
            </div>
          </div>
        ) : null}
        {highlightedOptions.length > 0 ? (
          <div className="container-shell mt-8">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Common decisions</p>
              <h2 className="mt-2 text-3xl font-black text-ink">What customers usually compare before they order</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {highlightedOptions.map((option) => (
                  <article key={option.name} className="rounded-[1.2rem] border border-line bg-canvas p-4">
                    <p className="text-sm font-black text-ink">{option.label}</p>
                    {option.helperText ? <p className="mt-2 text-sm leading-6 text-slate">{option.helperText}</p> : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {option.choices?.slice(0, 4).map((choice) => (
                        <span key={choice.value} className="value-chip">
                          {choice.label}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div className="container-shell mt-8">
          <ProductOrderStudio product={product} />
        </div>
      </section>

      <section className="border-y border-line bg-canvas section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <TimelineRulesPanel />
          <PaymentClarityPanel />
        </div>
        <div className="container-shell mt-6 grid gap-4 lg:grid-cols-3">
          <article className="premium-surface p-6">
            <h2 className="text-2xl font-black text-ink">This product usually runs on</h2>
            <p className="mt-3 text-sm leading-7 text-slate">{product.turnaround}</p>
          </article>
          <article className="premium-surface p-6">
            <h2 className="text-2xl font-black text-ink">Rush policy</h2>
            <p className="mt-3 text-sm leading-7 text-slate">{product.rushNote ?? "Rush timing is reviewed after artwork, quantity, and finishing are confirmed."}</p>
          </article>
          <article className="premium-surface p-6">
            <h2 className="text-2xl font-black text-ink">Pickup or delivery</h2>
            <p className="mt-3 text-sm leading-7 text-slate">{product.pickupDeliveryNote}</p>
          </article>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <section className="surface-card p-6">
            <p className="editorial-kicker">How customers usually use this service</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Common order scenarios</h2>
            <div className="mt-6 grid gap-4">
              {product.idealFor.map((item, index) => (
                <article key={item} className="rounded-[1.2rem] border border-line bg-canvas p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Scenario {index + 1}</p>
                  <p className="mt-2 text-sm font-black text-ink">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">
                    {index === 0
                      ? "Best when the job needs to look polished and move forward with fewer production questions."
                      : index === 1
                        ? "Helpful when the format, message, or finish should match a specific business or campaign goal."
                        : "A strong fit when local support, file review, or timing guidance matters before the order is locked in."}
                  </p>
                </article>
              ))}
            </div>
          </section>
          <ServiceSupportPanel product={product} />
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
