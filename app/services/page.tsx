import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { buildMetadata } from "@/lib/metadata";
import { localLandingPages } from "@/data/cro";
import { services } from "@/lib/site";
import Link from "next/link";

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
        title="Choose the print service. We will help shape the right production path."
        description="Business cards, flyers, banners, documents, passport photos, technical prints, and custom jobs with practical local guidance from file setup to pickup."
        ctaLabel="Get My Quote"
        eyebrow="Services"
        highlights={["Business and marketing print", "Technical and document support", "Quote-first help for custom work"]}
      />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Start here"
            title="Find the right path for your next print job."
            description="Choose a common product when speed matters, or use a quote-first service when the job needs custom stock, finishing, sizing, or artwork review."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="story-panel pl-7">
              <p className="editorial-kicker">How to choose</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Use the service that matches how ready the job is.</h2>
              <div className="mt-5 space-y-3">
                {serviceModes.map((mode) => (
                  <div key={mode.title} className="signal-card">
                    <p className="text-sm font-black text-ink">{mode.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{mode.description}</p>
                  </div>
                ))}
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
            eyebrow="Local landing pages"
            title="Popular local print searches"
            description="High-intent pages built for customers looking for specific print services in Scarborough and Toronto."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {localLandingPages.map((page) => (
              <Link key={page.slug} href={`/local/${page.slug}`} className="premium-card premium-surface p-5 hover:border-brand/35 hover:shadow-card">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">{page.location}</p>
                <p className="text-lg font-black text-ink">{page.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{page.intro}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate">View local page</p>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <LeadCtaPanel />
          </div>
        </div>
      </section>
    </>
  );
}
