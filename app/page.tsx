import Link from "next/link";
import { CategoryDirectory } from "@/components/catalog/category-directory";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductCard } from "@/components/commerce/product-card";
import { ContactStrip } from "@/components/sections/contact-strip";
import { ServiceCard } from "@/components/sections/service-card";
import { Badge, Button, Card, Icon, PageSection, SectionHeading } from "@/components/ui";
import {
  catalogUtilityLinks,
  featuredCatalogCollections,
  getCatalogNavigationFamilies,
  industryPaths,
} from "@/data/catalog";
import { getFeaturedProducts } from "@/data/products";
import { siteConfig, services } from "@/lib/site";

const featuredFamilies = getCatalogNavigationFamilies().slice(0, 3);
const featuredProducts = getFeaturedProducts().slice(0, 3);
const featuredServices = services.slice(0, 3);
const featuredShortcuts = catalogUtilityLinks.slice(0, 3);
const trustPillars = [
  "Structured quote review before complex jobs move into production",
  "Warm local support for rush timelines, file prep, and pickup planning",
  "One shared platform for browse, upload, help, and repeat-order paths",
];

export default function HomePage() {
  return (
    <main>
      <PageSection spacing="hero" className="overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.09),transparent_26rem),radial-gradient(circle_at_right,rgba(18,17,16,0.05),transparent_32rem)]" aria-hidden="true" />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-3xl">
            <h1 className="display-title text-balance text-[3.25rem] font-semibold leading-[0.92] sm:text-[4.5rem] lg:text-[5.35rem]">
              Premium print paths for businesses that want clarity before production.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate sm:text-[1.06rem]">
              Browse products, request a guided quote, upload ready files, or talk to PrintMe when the job needs a more careful plan. The experience is designed to feel calm, local, and production-aware from the first click.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/products" size="lg" trailingIcon={<Icon name="arrow" className="h-4 w-4" />}>
                Explore the Catalog
              </Button>
              <Button href="/quote-request" variant="secondary" size="lg">
                Request a Custom Quote
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {trustPillars.map((item) => (
                <span key={item} className="value-chip">
                  <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Card variant="panel" className="grid gap-4 p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  title: "Browse by product family",
                  copy: "Move through stationery, marketing materials, signage, packaging, documents, or custom work without losing the bigger production picture.",
                  href: "/products",
                  icon: "bag",
                },
                {
                  title: "Start with support",
                  copy: "Use the guided quote path when the size, stock, file, or timeline still needs a real review before checkout.",
                  href: "/quote-request",
                  icon: "document",
                },
                {
                  title: "Need a fast answer?",
                  copy: "Call the shop when the deadline is close, the file is uncertain, or you need help choosing the safest route.",
                  href: siteConfig.phoneHref,
                  icon: "phone",
                },
              ].map((item) => (
                <Card key={item.title} variant="surface" className="signal-card p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
                    <Icon name={item.icon} className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="mt-4 text-lg font-black text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.copy}</p>
                  <Button href={item.href} variant="secondary" className="mt-5 self-start px-4 py-2 text-[11px]">
                    {item.href.startsWith("tel:") ? "Call PrintMe" : "Open Path"}
                  </Button>
                </Card>
              ))}
            </div>
            <Card variant="glass" className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Why this flow feels different</p>
              <h2 className="mt-2 text-[1.65rem] font-black leading-[1.02] text-ink">A serious print-commerce front door, not a loose collection of product pages.</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                PrintMe combines browseable product families with real support entry points, local pickup confidence, and production-minded guidance for specialty work.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="focus-band p-4 text-sm leading-6 text-slate">
                  <p className="font-black text-ink">Local Scarborough pickup</p>
                  <p className="mt-1">{siteConfig.shortAddress}</p>
                </div>
                <div className="focus-band p-4 text-sm leading-6 text-slate">
                  <p className="font-black text-ink">Rush-aware support</p>
                  <p className="mt-1">Call ahead when timing is tight and the file is ready for review.</p>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </PageSection>

      <PageSection tone="white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title="Browse the major print families first"
            description="The homepage now starts from the stable catalog structure so future browsing, search, and support improvements can extend one shared system instead of branching into disconnected prototypes."
          />
          <Button href="/products" variant="secondary" className="self-start lg:self-auto">
            View Full Catalog
          </Button>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {featuredFamilies.map((family) => (
            <Card key={family.slug} as="article" variant="surface" interactive className="p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
                  <Icon name={family.icon} className="h-5 w-5" />
                </span>
                {family.productCountLabel ? <Badge variant="secondary">{family.productCountLabel}</Badge> : null}
              </div>
              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate">{family.shortTitle}</p>
              <h2 className="mt-2 font-display text-[1.7rem] leading-[1.02] text-ink">{family.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate">{family.overview ?? family.description}</p>
              <div className="focus-band mt-4 p-4 text-xs leading-5 text-slate">
                <p className="font-black text-ink">Best for</p>
                <p className="mt-1">{family.highlight}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {family.trustNotes.slice(0, 2).map((note) => (
                  <span key={note} className="value-chip">
                    {note}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                <Link href={`/products/category/${family.slug}`} className="text-[11px] font-black uppercase tracking-[0.16em] text-brand transition hover:text-ink">
                  Open family
                </Link>
                <span className="text-sm font-black text-ink">Structured browsing</span>
              </div>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection tone="band">
        <div className="grid gap-8 xl:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionHeading
              title="Featured product paths that already fit the shared ordering system"
              description="These are the strongest examples of the repaired PrintMe foundation: rich product detail, guided actions, and clear conversion paths that future premium UI work can extend safely."
            />
            <div className="mt-6 grid gap-3">
              {featuredCatalogCollections.slice(0, 3).map((collection) => (
                <Card key={collection.title} variant="surface" className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-ink">{collection.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate">{collection.description}</p>
                    </div>
                    {collection.badge ? <Badge variant="secondary">{collection.badge}</Badge> : null}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection tone="white">
        <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
          <div>
            <SectionHeading
              title="Services and support entry points stay close to the catalog"
              description="Support should feel embedded into discovery, not bolted on later. These service surfaces reuse the repaired data layer and shared card system so future enhancements stay consistent."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featuredServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>

          <Card variant="dark" className="p-6 sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-light">Start here when you are not ready to order</p>
            <h2 className="mt-3 text-balance text-[2.05rem] font-black leading-[0.98] text-white">
              Choose the clearest next step instead of guessing which route fits.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Whether the job needs artwork review, production guidance, support, or a custom quote, the safest path should be visible from the same system as the products themselves.
            </p>
            <div className="mt-6 grid gap-3">
              {featuredShortcuts.map((item) => (
                <Card key={item.title} variant="dark" className="rounded-[1.25rem] border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.08] text-brand-light">
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/65">{item.description}</p>
                      <Button href={item.href} variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10 hover:text-white">
                        Open
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-8 xl:grid-cols-[1fr_1.02fr]">
          <div>
            <SectionHeading
              title="A cleaner path into search, industries, and support-led discovery"
              description="This area reinforces the golden pattern for downstream browsing sections: one strong intro, a structured primary grid, and contextual support actions instead of noisy mixed layouts."
            />
            <div className="mt-8">
              <CategoryDirectory />
            </div>
          </div>
          <div className="space-y-6">
            <Card variant="glass" className="p-6 sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Browse by use case</p>
              <h2 className="mt-3 text-[1.9rem] font-black leading-[1.02] text-ink">Industries and real-world print contexts</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                These paths help customers who know the business context before they know the exact product name.
              </p>
              <div className="mt-5 grid gap-3">
                {industryPaths.map((industry) => (
                  <Link key={industry.slug} href={industry.href} className="rounded-[1.25rem] border border-line/70 bg-white/88 px-4 py-4 transition hover:border-brand/20 hover:bg-white">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
                        <Icon name={industry.icon} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-ink">{industry.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate">{industry.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card variant="surface" className="p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Protected baseline</p>
              <h2 className="mt-2 text-[1.65rem] font-black leading-[1.03] text-ink">Built from the repaired foundation, not from a fresh redesign branch.</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                The homepage now uses the shared `Button`, `Card`, `SectionHeading`, `PageSection`, catalog data, services data, and existing product/service cards. That keeps future premium work incremental and reviewable.
              </p>
              <div className="mt-5 rounded-[1.25rem] border border-line/80 bg-canvas px-4 py-4 text-sm leading-6 text-slate">
                Next safe areas to evolve from this pattern: the header mega menu, search entry panel, category landing intros, and support shortcut surfaces.
              </div>
            </Card>
          </div>
        </div>
      </PageSection>

      <ContactStrip />
      <FinalCta />
    </main>
  );
}
