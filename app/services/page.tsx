import { BrandArchitecturePanel } from "@/components/catalog/brand-architecture-panel";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryDirectory } from "@/components/catalog/category-directory";
import { ReviewProofPanel } from "@/components/conversion/review-proof-panel";
import { ServiceCard } from "@/components/sections/service-card";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { buildMetadata } from "@/lib/metadata";
import { localLandingPages } from "@/data/cro";
import { brandVisuals } from "@/data/brand-visuals";
import { services } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "Print Services in Scarborough",
  description: "Explore business cards, flyers, brochures, posters, signs, stickers, document printing, rush printing, and custom print services at PrintMe Design in Scarborough.",
  path: "/services",
});

export default function ServicesPage() {
  const serviceModes = [
    {
      title: "Fast standard jobs",
      description: "Use this path when the size, quantity, and output are straightforward and you want to move quickly.",
    },
    {
      title: "Custom and quote-first work",
      description: "Best for specialty materials, finishing, large-format needs, uncertain specs, or artwork that still needs review.",
    },
    {
      title: "Local support if you are unsure",
      description: "Call, use chat, or send a quote request when you need help choosing the cleanest production path.",
    },
  ];

  return (
    <>
      <PageHero
        title="Choose the print service, then take the clearest next step."
        description="PrintMe handles business cards, flyers, banners, documents, passport photos, technical prints, and custom jobs with practical local guidance from file setup to pickup."
        ctaLabel="Request a Quote"
        eyebrow="Services"
        highlights={["Business and marketing print", "Technical and document support", "Quote-first help for custom work"]}
      />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Start here"
            title="Find the right path for your next print job."
            description="Choose a common product when speed matters, or use a quote-first service when the job needs custom stock, finishing, sizing, artwork review, or design help."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[1.7rem] border border-line/75 bg-white shadow-soft">
                <div className="relative aspect-[1.18/0.98]">
                  <Image
                    src={brandVisuals.consultation.src}
                    alt={brandVisuals.consultation.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(20,18,16,0.3))]" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.35rem] border border-white/60 bg-white/86 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_28px_rgba(18,17,16,0.08)] backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">How to choose</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-ink">Talk through materials, timing, finishing, and file setup when the job is not fully ready yet.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.7rem] border border-line/75 bg-white p-6 shadow-soft">
                <p className="editorial-kicker">Service path logic</p>
                <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Use the service that matches how ready the job is.</h2>
                <p className="mt-3 text-sm leading-7 text-slate">
                  If you already know the size, quantity, and product, move fast. If you still need materials, finishing, turnaround, or file advice, use the quote-first route instead.
                </p>
                <div className="mt-5 space-y-3">
                  {serviceModes.map((mode) => (
                    <div key={mode.title} className="signal-card">
                      <p className="text-sm font-black text-ink">{mode.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate">{mode.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section-space bg-canvas">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Full service families"
            title="Structured service pillars, not one giant menu."
            description="PrintMe keeps one core brand, but major service families get their own clearer landing paths."
          />
          <div className="mt-8">
            <CategoryDirectory />
          </div>
          <div className="mt-8">
            <BrandArchitecturePanel />
          </div>
          <div className="mt-8">
            <ReviewProofPanel />
          </div>
        </div>
      </section>
      <section className="section-tight bg-canvas">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Local landing pages"
            title="Popular local print searches"
            description="High-intent pages for customers looking for specific print services in Scarborough and Toronto."
          />
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {localLandingPages.map((page) => (
              <Link key={page.slug} href={`/local/${page.slug}`} className="rounded-[1.35rem] border border-line/80 bg-white px-5 py-4 text-sm transition hover:border-brand/20 hover:bg-white">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">{page.location}</p>
                <p className="mt-2 text-base font-black text-ink">{page.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{page.intro}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Business essentials",
                detail: "Cards, envelopes, cheques, letterhead-style stationery, and repeat office print that should feel dependable and polished.",
              },
              {
                title: "Marketing and outreach",
                detail: "Flyers, brochures, postcards, posters, promotional print, and print-and-mail pieces for launches and local campaigns.",
              },
              {
                title: "Custom and support-led work",
                detail: "Design help, technical drawings, signs, banners, and specialty jobs that benefit from a guided quote before production.",
              },
            ].map((item) => (
              <article key={item.title} className="premium-surface p-5">
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-line/70 bg-white shadow-[0_24px_50px_rgba(18,17,16,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="relative min-h-[280px]">
                <Image
                  src={brandVisuals.rangeHero.src}
                  alt={brandVisuals.rangeHero.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="editorial-kicker">What PrintMe handles</p>
                <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">A wider print range, presented in a cleaner way.</h2>
                <p className="mt-3 text-sm leading-7 text-slate">
                  Use PrintMe for marketing pieces, stationery, brochures, packaging-style items, rigid signs, and support-led custom work without digging through a cluttered catalog first.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href="/products" className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-brand">
                    Browse Products
                  </Link>
                  <Link href="/quote-request" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-canvas px-5 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:border-brand/25 hover:text-brand">
                    Start a Custom Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <LeadCtaPanel />
          </div>
        </div>
      </section>
    </>
  );
}
