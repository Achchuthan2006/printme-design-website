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
  return (
    <>
      <PageHero
        title="Choose the print service. We will help with the details."
        description="Business cards, flyers, banners, documents, passport photos, technical prints, and custom jobs with practical local guidance from file setup to pickup."
        ctaLabel="Get My Quote"
      />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Start here"
            title="Find the right path for your next print job"
            description="Pick a common product to move faster, or use a quote-first service when the job needs custom stock, finishing, sizing, or artwork review."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
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
              <Link key={page.slug} href={`/local/${page.slug}`} className="rounded-2xl border border-line/90 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand/35 hover:shadow-card">
                <p className="text-lg font-black text-ink">{page.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{page.intro}</p>
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
