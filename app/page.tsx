import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { LocalTrustStrip } from "@/components/conversion/local-trust-strip";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { MobileBottomCta } from "@/components/sections/mobile-bottom-cta";
import { HeroPrintComposition } from "@/components/sections/print-product-visual";
import { ServiceCard } from "@/components/sections/service-card";
import { TrustBadge } from "@/components/sections/trust-badge";
import { buildMetadata } from "@/lib/metadata";
import { analyticsEvents, homeHeroVariants } from "@/data/cro";
import { processSteps, services, testimonials, whyChooseUs } from "@/lib/site";

const heroCopy = homeHeroVariants.default;

const serviceHighlights = [
  { icon: "clock", title: "Need it fast?", copy: "Send ready artwork and we will confirm the quickest realistic production path." },
  { icon: "store", title: "Pick up with confidence", copy: "Your order is reviewed before pickup at our Scarborough shop." },
  { icon: "van", title: "Local delivery guidance", copy: "Ask about delivery options for qualifying Scarborough, Toronto, and GTA orders." },
];

export const metadata = buildMetadata({
  title: "PrintMe Design | Scarborough Print Shop for Fast Custom Printing",
  description:
    "PrintMe Design is a Scarborough print shop with 20+ years of experience in document printing, passport photos, flyers, banners, cheques, engineering drawings, and custom print work.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-soft/55 to-transparent" aria-hidden="true" />
        <div className="container-shell relative grid gap-10 pb-12 pt-12 lg:grid-cols-[0.93fr_1.07fr] lg:items-center lg:pb-16 lg:pt-14">
          <div>
            <p className="hero-in text-[11px] font-black uppercase tracking-[0.22em] text-brand [--delay:40ms]">
              {heroCopy.eyebrow}
            </p>
            <h1 className="hero-in mt-4 max-w-2xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] text-ink [--delay:120ms] sm:text-5xl lg:text-[64px]">
              {heroCopy.headline}
            </h1>
            <p className="hero-in mt-5 max-w-xl text-sm leading-7 text-slate [--delay:210ms] sm:text-base">
              {heroCopy.subheadline}
            </p>
            <div className="hero-in mt-7 flex flex-col gap-3 [--delay:300ms] sm:flex-row">
              <Button href="/quote-request" data-event={analyticsEvents.heroQuoteClick}>
                {heroCopy.primaryCta}
                <span aria-hidden="true" className="ml-2">-&gt;</span>
              </Button>
              <Button href="/services" variant="secondary" data-event={analyticsEvents.heroServicesClick}>
                {heroCopy.secondaryCta}
              </Button>
            </div>
            <div className="hero-in mt-7 flex flex-col gap-3 text-xs font-bold text-slate [--delay:390ms] sm:flex-row sm:items-center sm:gap-7">
              {heroCopy.trustItems.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <Icon name={index === 0 ? "store" : index === 1 ? "check" : "clock"} className="h-4 w-4 text-brand" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <HeroPrintComposition />
        </div>
      </section>

      <section className="reveal-up border-y border-line/80 bg-white py-10">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_24px_rgba(217,70,32,0.25)]">
              <Icon name="document" className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink">Print support that feels handled</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate">
                Bring the job, the deadline, or even the rough idea. We help local businesses and customers turn
                documents, marketing materials, business stationery, technical prints, and custom requests into clean
                finished pieces with fewer surprises.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["20+ years of print experience", "Practical artwork review", "Rush-aware production", "Real local support"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-ink">
                <Icon name="check" className="h-4 w-4 text-brand" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-up bg-canvas py-8">
        <div className="container-shell">
          <LocalTrustStrip />
        </div>
      </section>

      <section id="services" className="reveal-up bg-canvas section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Choose what you need"
            title="Print services that move your project forward"
            description="Start with the product, upload what you have, and let PrintMe guide the specs, timing, and finishing so you can order with confidence."
            align="center"
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => (
              <div key={service.slug} className="reveal-up">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href="/services" variant="secondary">
              Compare All Services
            </Button>
          </div>
        </div>
      </section>

      <section className="reveal-up bg-white section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand">Why customers come back</p>
            <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
              Clear advice before you print. Quality output after.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate">
              The right print job is not just ink on paper. It is the right file, quantity, stock, finish, timing,
              and pickup plan. We help you get those decisions right before production starts.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {whyChooseUs.map((item) => (
              <article key={item.title} className="reveal-up border-l border-line pl-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/30 text-brand">
                  <Icon name={item.icon} />
                </div>
                <h3 className="mt-5 text-base font-black text-ink">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-slate">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-up border-y border-line/80 bg-canvas py-10">
        <div className="container-shell grid gap-6 md:grid-cols-3">
          {serviceHighlights.map((item) => (
            <TrustBadge key={item.title} icon={item.icon} title={item.title} detail={item.copy} className="border-0 bg-transparent shadow-none" />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="reveal-up bg-white section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="How it works"
            title="From request to ready-for-pickup"
            description="A simple path for quote requests, uploaded files, online orders, and local pickup."
            align="center"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="group premium-card relative rounded-2xl border border-line/90 bg-white p-5 shadow-soft hover:border-brand/35 hover:shadow-card">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition duration-300 group-hover:border-brand/40 group-hover:text-brand">
                    <Icon name={index === 0 ? "flyer" : index === 1 ? "document" : "store"} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-ink">{step.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate">{step.description}</p>
                  </div>
                </div>
                {index < processSteps.length - 1 ? (
                  <div className="absolute -right-4 top-1/2 hidden text-lg font-black text-slate/35 lg:block">-&gt;</div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="reveal-up bg-canvas section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Local proof"
            title="Built for customers who need it done right"
            description="Realistic local customer stories that show the kind of speed, care, and clarity PrintMe is built to provide."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="premium-card rounded-lg border border-line bg-white p-6 shadow-soft hover:border-brand/30 hover:shadow-card">
                <p className="text-3xl font-black leading-none text-brand">"</p>
                <p className="mt-3 text-sm leading-7 text-slate">{item.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-black text-brand">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink">{item.name}</p>
                    <p className="text-xs text-slate">{item.company}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-up bg-white pb-0 pt-6 lg:pt-8">
        <div className="container-shell">
          <LeadCtaPanel
            title="Have a file, deadline, or custom idea?"
            description="Send the details now and we will help you choose the cleanest, fastest path to a finished print."
            primaryLabel="Get My Quote"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>

      <MobileBottomCta />
    </>
  );
}
