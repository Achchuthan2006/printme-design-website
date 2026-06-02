import Link from "next/link";
import { CategoryDirectory } from "@/components/catalog/category-directory";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductCard } from "@/components/commerce/product-card";
import { ServiceProductVisual, HeroPrintComposition } from "@/components/sections/print-product-visual";
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
import { services } from "@/lib/site";

const featuredFamilies = getCatalogNavigationFamilies().slice(0, 3);
const featuredProducts = getFeaturedProducts().slice(0, 3);
const featuredServices = services.slice(0, 3);
const featuredShortcuts = catalogUtilityLinks.slice(0, 3);
const categoryStripFamilies = getCatalogNavigationFamilies().slice(0, 6);
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
        <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand">Print, elevated.</p>
            <h1 className="display-title mt-5 text-balance text-[3.35rem] font-semibold leading-[0.9] sm:text-[4.65rem] lg:text-[5.6rem]">
              Print that makes an impression.
            </h1>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-8 text-slate">
              Premium print, thoughtful design, and reliable local service in one calm platform. From business cards to custom packaging, PrintMe helps good ideas arrive production-ready.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/products" size="lg" trailingIcon={<Icon name="arrow" className="h-4 w-4" />}>
                Explore the Catalog
              </Button>
              <Button href="/support" variant="secondary" size="lg">
                See How It Works
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-2.5">
              {trustPillars.map((item) => (
                <span key={item} className="value-chip">
                  <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 xl:pl-4">
            <HeroPrintComposition />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "Custom quotes",
                  copy: "Start with the guided path when the job needs sizing, material, or finishing review.",
                  href: "/quote-request",
                  icon: "document",
                },
                {
                  title: "Trade and volume printing",
                  copy: "Bulk and repeat-order support for businesses, teams, and larger campaigns.",
                  href: "/support",
                  icon: "bag",
                },
                {
                  title: "Help and resources",
                  copy: "Artwork guidance, shipping details, templates, and practical support shortcuts.",
                  href: "/support",
                  icon: "chat",
                },
              ].map((item) => (
                <Card key={item.title} variant="surface" className="p-4 sm:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] border border-brand/15 bg-brand-soft text-brand">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </div>
                  <h2 className="mt-4 text-base font-black text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.copy}</p>
                  <Button href={item.href} variant="secondary" className="mt-4 px-4 py-2 text-[11px]">
                    Open
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection tone="white" spacing="tight" contentClassName="max-w-[1400px]">
        <Card variant="surface" className="rounded-[2rem] p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {categoryStripFamilies.map((family) => (
              <Link
                key={family.slug}
                href={`/products/category/${family.slug}`}
                className="group rounded-[1.45rem] border border-white/80 bg-white/82 p-3 transition hover:-translate-y-0.5 hover:border-brand/18 hover:shadow-card"
              >
                <ServiceProductVisual slug={family.spotlightSlugs?.[0] ?? family.slug} />
                <div className="px-1 pb-1 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">{family.shortTitle}</p>
                  <h2 className="mt-2 text-[1.08rem] font-black leading-[1.05] text-ink transition group-hover:text-brand">{family.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate">{family.description}</p>
                  <p className="mt-3 text-[11px] font-black uppercase tracking-[0.16em] text-brand">Browse family</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </PageSection>

      <PageSection tone="white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title="Browse the major print families first"
            description="The homepage keeps the current direction but refines it into a calmer, more editorial catalog entry: stronger hierarchy above, more curated family browsing here, and a cleaner path into support and custom work."
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
