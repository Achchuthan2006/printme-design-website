import { notFound } from "next/navigation";
import Link from "next/link";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { LocalContactCard } from "@/components/conversion/local-contact-card";
import { LocalTrustStrip } from "@/components/conversion/local-trust-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/metadata";
import { getLocalLandingPage, localLandingPages } from "@/data/cro";
import { services } from "@/lib/site";

export function generateStaticParams() {
  return localLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLocalLandingPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/local/${page.slug}`,
  });
}

export default async function LocalLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLocalLandingPage(slug);
  if (!page) notFound();

  const relatedServices = services.filter((service) => page.services.includes(service.title));

  return (
    <>
      <section className="relative overflow-hidden bg-white section-space">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-soft/60 to-transparent" aria-hidden="true" />
        <div className="container-shell relative grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <Badge>{page.location} print service</Badge>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl">
              {page.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/quote-request" data-event="landing_quote_click">{page.primaryCta}</Button>
              <Button href="/contact" variant="secondary">{page.secondaryCta}</Button>
            </div>
          </div>
          <LocalContactCard />
        </div>
      </section>

      <section className="border-y border-line/80 bg-canvas py-10">
        <div className="container-shell">
          <LocalTrustStrip />
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Relevant services</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-ink">{page.serviceFocus} that fits local deadlines</h2>
            <p className="mt-4 text-sm leading-7 text-slate">
              These are the most relevant PrintMe services for this request. If your project has custom sizing, finishing, or artwork needs, start with a quote.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/products/${service.slug}`}
                className="rounded-2xl border border-line/90 bg-canvas p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand/35 hover:bg-brand-soft/30"
              >
                <p className="text-lg font-black text-ink">{service.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Why this works</p>
            <div className="mt-5 grid gap-4">
              {page.proofPoints.map((point) => (
                <div key={point} className="flex gap-3 rounded-2xl border border-line/80 bg-canvas p-4">
                  <Icon name="check" className="mt-0.5 h-5 w-5 text-brand" />
                  <p className="text-sm font-bold leading-6 text-ink">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Questions customers ask</p>
            <div className="mt-5 space-y-4">
              {page.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3 className="text-base font-black text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-0 pt-8">
        <div className="container-shell">
          <LeadCtaPanel
            title={`Need ${page.serviceFocus.toLowerCase()} in ${page.location}?`}
            description="Send the details now and PrintMe will help confirm the cleanest route to quote, production, pickup, or delivery."
            primaryLabel={page.primaryCta}
            secondaryLabel={page.secondaryCta}
          />
        </div>
      </section>
    </>
  );
}
