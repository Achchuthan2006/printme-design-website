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
  { icon: "clock", title: "Rush-aware guidance", copy: "When timing matters, we tell you what is realistic before production starts." },
  { icon: "store", title: "Pickup with confidence", copy: "Orders are reviewed, organized, and ready for pickup from our Scarborough shop." },
  { icon: "van", title: "Delivery when it fits", copy: "Ask about delivery options for qualifying Scarborough, Toronto, and GTA orders." },
];

const journeyOptions = [
  {
    title: "I know what I need",
    description: "Browse orderable products, compare specs, and move into checkout with file review still built in.",
    cta: "Browse Products",
    href: "/products",
    icon: "bag",
  },
  {
    title: "I need a quote first",
    description: "Best for custom sizes, finishing, specialty materials, rush-sensitive jobs, and production questions.",
    cta: "Start My Quote",
    href: "/quote-request",
    icon: "document",
  },
  {
    title: "I need a real answer quickly",
    description: "Use support or call the shop when timing is tight, files are unclear, or the path still needs shaping.",
    cta: "Get Support",
    href: "/support",
    icon: "phone",
  },
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
      <section className="relative overflow-hidden bg-white pb-8 pt-8 sm:pb-10 sm:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.10),transparent_32rem),radial-gradient(circle_at_86%_14%,rgba(31,27,24,0.06),transparent_26rem)]" aria-hidden="true" />
        <div className="container-shell relative">
          <div className="hero-panel quiet-grid px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="absolute inset-y-0 right-0 hidden w-[40%] bg-[linear-gradient(135deg,rgba(255,255,255,0),rgba(217,70,32,0.09))] lg:block" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <p className="hero-in editorial-kicker [--delay:40ms]">{heroCopy.eyebrow}</p>
                <h1 className="display-title hero-in mt-4 max-w-2xl text-balance text-[3.2rem] font-black leading-[0.92] [--delay:120ms] sm:text-[4.9rem]">
                  {heroCopy.headline}
                </h1>
                <p className="hero-in mt-5 max-w-xl text-[15px] leading-8 text-slate [--delay:210ms] sm:text-lg">
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
                <div className="hero-in mt-7 grid gap-3 text-xs font-bold text-slate [--delay:390ms] sm:grid-cols-3">
                  {heroCopy.trustItems.map((item, index) => (
                    <div key={item} className="premium-stat flex items-center gap-3 p-3">
                      <Icon name={index === 0 ? "store" : index === 1 ? "check" : "clock"} className="h-4 w-4 text-brand" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-in mt-7 grid gap-4 sm:grid-cols-3 [--delay:470ms]">
                  <div className="premium-stat">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">Trusted locally</p>
                    <p className="mt-2 text-2xl font-black text-ink">20+ years</p>
                    <p className="mt-1 text-sm leading-6 text-slate">Supporting local businesses, events, schools, and everyday print jobs.</p>
                  </div>
                  <div className="premium-stat">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">Handled carefully</p>
                    <p className="mt-2 text-2xl font-black text-ink">File review first</p>
                    <p className="mt-1 text-sm leading-6 text-slate">Artwork, timing, and finishing are checked before your job moves forward.</p>
                  </div>
                  <div className="premium-stat">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">Built for action</p>
                    <p className="mt-2 text-2xl font-black text-ink">Quote or order</p>
                    <p className="mt-1 text-sm leading-6 text-slate">Start with a fast quote, upload artwork, or move directly into checkout.</p>
                  </div>
                </div>
              </div>
              <HeroPrintComposition />
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-up bg-white section-tight">
        <div className="container-shell">
          <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="story-panel pl-7">
              <p className="editorial-kicker">Start the right way</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink sm:text-[2.5rem]">Three clean paths, depending on how ready the job is.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
                Some customers are ready to order now. Others need sizing, timing, finishing, or artwork help first. The site should make both paths feel easy and intentional.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {journeyOptions.map((option) => (
                <article key={option.title} className="premium-surface flex h-full flex-col p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                    <Icon name={option.icon} className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-ink">{option.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate">{option.description}</p>
                  <div className="mt-5">
                    <Button href={option.href} variant="secondary" className="w-full px-4 py-2.5 text-xs">
                      {option.cta}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-up section-band py-10">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-ink text-white shadow-[0_18px_30px_rgba(22,19,17,0.18)]">
              <Icon name="document" className="h-8 w-8" />
            </div>
            <div>
              <p className="editorial-kicker">Why it converts</p>
              <h2 className="display-title mt-2 text-balance text-[2.4rem] font-black leading-[0.98]">Print support that feels handled, not handed off.</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate">
                Bring the job, the deadline, or even the rough idea. We help local businesses and customers turn documents, marketing materials, stationery, technical prints, and custom requests into clean finished pieces with fewer surprises.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["20+ years of print experience", "Practical artwork review", "Rush-aware production", "Real local support"].map((item) => (
              <div key={item} className="premium-surface flex items-center gap-3 p-4 text-sm font-bold text-ink">
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
            eyebrow="Choose your path"
            title="Print services designed to move the job forward quickly."
            description="Start with a common product when you want speed, or move into a quote-led workflow when the job needs custom sizing, finishing, artwork review, or local advice."
            align="center"
          />
          <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="story-panel pl-7">
              <p className="editorial-kicker">Best use cases</p>
              <h3 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Built for everyday essentials, marketing campaigns, and custom jobs that need guidance.</h3>
              <div className="mt-5 grid gap-3">
                {[
                  "Business cards, brochures, flyers, and handouts that need a polished first impression",
                  "Documents, technical plans, and practical print work that should feel handled carefully",
                  "Banners, signs, passport photos, and custom requests that benefit from local advice before production",
                ].map((item) => (
                  <div key={item} className="signal-card">
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand" />
                      <p className="text-sm leading-6 text-slate">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button href="/products">Browse Products</Button>
                <Button href="/quote-request" variant="secondary">Request a Custom Quote</Button>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {services.slice(0, 8).map((service) => (
                <div key={service.slug} className="reveal-up">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
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
            <p className="editorial-kicker">Why customers come back</p>
            <h2 className="display-title mt-3 text-balance text-[2.7rem] font-black leading-[0.98] text-ink sm:text-[3.8rem]">
              Clear advice before print. Confident output after.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-slate">
              The right print job is not just ink on paper. It is the right file, quantity, stock, finish, timing, and pickup plan. We help you get those decisions right before production starts.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {whyChooseUs.map((item) => (
              <article key={item.title} className="reveal-up premium-surface p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/25 bg-brand-soft text-brand">
                  <Icon name={item.icon} />
                </div>
                <h3 className="mt-5 text-base font-black text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-up section-band bg-canvas py-10">
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
            title="From first question to finished print, without the usual uncertainty."
            description="A clear path for quote requests, uploaded files, online orders, and pickup or delivery planning."
            align="center"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="group premium-card premium-depth relative rounded-[1.7rem] border border-line/90 bg-white p-6 hover:border-brand/35 hover:shadow-card">
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
            title="Trusted by customers who need the work to feel polished, fast, and under control."
            description="The kind of local print support people come back for when the deadline is real and the finished result needs to represent their business well."
            align="center"
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
            <div className="story-panel pl-7">
              <p className="editorial-kicker">What people value most</p>
              <h3 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Speed matters. Clarity matters more.</h3>
              <p className="mt-3 text-sm leading-7 text-slate">
                Repeat customers come back because the process feels calmer: timing is discussed honestly, files are reviewed, and the finished work lands with more confidence.
              </p>
              <div className="mt-5 grid gap-3">
                {["Honest timing before commitment", "Artwork and production details reviewed together", "A local team that is easier to reach when something is urgent"].map((item) => (
                  <div key={item} className="value-chip w-fit">
                    <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="premium-card premium-depth rounded-[1.7rem] border border-line bg-white p-6 hover:border-brand/30 hover:shadow-card">
                <p className="font-display text-5xl leading-none text-brand">"</p>
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
        </div>
      </section>

      <section className="reveal-up bg-white pb-0 pt-6 lg:pt-8">
        <div className="container-shell">
          <LeadCtaPanel
            title="Have the file, the deadline, or just the rough idea?"
            description="Send the details now and PrintMe will help you choose the cleanest, fastest, most realistic path to a finished print job."
            primaryLabel="Get My Quote"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>

      <MobileBottomCta />
    </>
  );
}
