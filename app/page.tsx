import { CategoryDirectory } from "@/components/catalog/category-directory";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { LocalContactCard } from "@/components/conversion/local-contact-card";
import { LocalTrustStrip } from "@/components/conversion/local-trust-strip";
import { ReviewProofPanel } from "@/components/conversion/review-proof-panel";
import { MobileBottomCta } from "@/components/sections/mobile-bottom-cta";
import { HeroPrintComposition } from "@/components/sections/print-product-visual";
import { ServiceCard } from "@/components/sections/service-card";
import { TrustBadge } from "@/components/sections/trust-badge";
import { BrandArchitecturePanel } from "@/components/catalog/brand-architecture-panel";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { analyticsEvents, homeHeroVariants } from "@/data/cro";
import { brandVisuals } from "@/data/brand-visuals";
import { buildMetadata } from "@/lib/metadata";
import { processSteps, services, siteConfig, whyChooseUs } from "@/lib/site";
import Image from "next/image";

const heroCopy = homeHeroVariants.default;

const serviceHighlights = [
  { icon: "clock", title: "Rush-aware guidance", copy: "When timing matters, we tell you what is realistic before production starts." },
  { icon: "store", title: "Pickup with confidence", copy: "Orders are reviewed, organized, and ready for pickup from our Scarborough shop." },
  { icon: "van", title: "Delivery when it fits", copy: "Ask about delivery options for qualifying Scarborough, Toronto, and GTA orders." },
];

const heroServiceSignals = [
  "Business cards, flyers, brochures, and postcards",
  "Signs, banners, promotional print, and custom jobs",
  "Documents, passport photos, technical prints, and local support",
];

const journeyOptions = [
  {
    title: "I know what I need",
    description: "Browse common print products, compare options, and move into cart or checkout when the job is straightforward.",
    cta: "Browse Products",
    href: "/products",
    icon: "bag",
  },
  {
    title: "I need a quote first",
    description: "Best for custom sizes, design help, specialty materials, rush-sensitive jobs, or anything that still needs review.",
    cta: "Request a Quote",
    href: "/quote-request",
    icon: "document",
  },
  {
    title: "I need a real answer quickly",
    description: "Call or use support when timing is tight, files are unclear, or you want to confirm the right path before ordering.",
    cta: "Talk to PrintMe",
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
      <section className="relative overflow-hidden bg-white/55 pb-8 pt-8 sm:pb-10 sm:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.08),transparent_28rem)]" aria-hidden="true" />
        <div className="container-shell relative">
          <div className="hero-panel px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-11">
            <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <p className="hero-in editorial-kicker [--delay:40ms]">{heroCopy.eyebrow}</p>
                <h1 className="display-title hero-in mt-4 max-w-2xl text-balance text-[3.25rem] font-semibold leading-[0.9] [--delay:120ms] sm:text-[5.1rem]">
                  <span className="headline-accent">{heroCopy.headline}</span>
                </h1>
                <p className="hero-in mt-5 max-w-xl text-[15px] leading-8 text-slate [--delay:210ms] sm:text-lg">
                  Premium print, signs, and design support with clear paths for quote-first, direct order, and local pickup.
                </p>
                <p className="hero-in mt-4 max-w-2xl text-sm font-bold leading-6 text-ink [--delay:250ms]">
                  Order when the specs are clear. Quote when the job is custom. Call when timing matters.
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
                <div className="hero-in mt-5 flex flex-wrap gap-2 [--delay:345ms]">
                  {heroServiceSignals.map((item) => (
                    <span key={item} className="value-chip">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="hero-in mt-7 grid gap-3 text-xs font-bold text-slate [--delay:390ms] sm:grid-cols-3">
                  {heroCopy.trustItems.map((item, index) => (
                    <div key={item} className="premium-stat flex items-center gap-3 p-3">
                      <Icon name={index === 0 ? "store" : index === 1 ? "check" : "clock"} className="h-4 w-4 text-brand" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-in mt-5 liquid-glass rounded-[1.55rem] px-4 py-4 text-sm leading-6 text-slate [--delay:430ms]">
                  <p className="font-black text-ink">Visit, call, or send files online.</p>
                  <p className="mt-1">Pickup at {siteConfig.address}. Call {siteConfig.phone} for rush questions, passport photo availability, or custom print help.</p>
                </div>
                <div className="hero-in mt-7 grid gap-4 sm:grid-cols-2 [--delay:470ms]">
                  <div className="premium-stat p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">Trusted locally</p>
                    <p className="mt-2 text-2xl font-black text-ink">20+ years</p>
                    <p className="mt-1 text-sm leading-6 text-slate">Supporting local businesses, events, schools, and everyday print jobs.</p>
                  </div>
                  <div className="premium-stat p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">Handled carefully</p>
                    <p className="mt-2 text-2xl font-black text-ink">File review first</p>
                    <p className="mt-1 text-sm leading-6 text-slate">Artwork, timing, and finishing are checked before your job moves forward.</p>
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
          <div className="section-frame grid gap-5 p-5 xl:grid-cols-[0.92fr_1.08fr] xl:p-6">
            <div className="editorial-panel pl-7 pr-5 py-5">
              <p className="editorial-kicker">Start the right way</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink sm:text-[2.5rem]">Three clear ways to start.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
                Pick the path that matches the job instead of forcing the wrong checkout flow.
              </p>
              <div className="mt-5 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                <p className="font-black text-ink">Simple rule for faster progress</p>
                <p className="mt-1">If the job is custom, rush-sensitive, or still fuzzy, the quote path usually gets you to the right answer faster than guessing through checkout.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {journeyOptions.map((option) => (
                <article key={option.title} className="premium-surface flex h-full flex-col p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                    <Icon name={option.icon} className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-5 text-[1.15rem] font-black leading-[1.04] text-ink">{option.title}</h3>
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

      <section className="reveal-up section-band py-8">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-ink text-white shadow-[0_18px_30px_rgba(22,19,17,0.18)]">
              <Icon name="document" className="h-8 w-8" />
            </div>
            <div>
              <p className="editorial-kicker">Why it converts</p>
              <h2 className="display-title mt-2 text-balance text-[2.4rem] font-black leading-[0.98]">One local shop for print orders that need fewer surprises.</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate">
                Bring the job, the deadline, or even the rough idea. We help local businesses and customers turn documents, marketing materials, stationery, technical prints, and custom requests into clean finished pieces with clear next steps.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["20+ years of print experience", "Practical artwork review", "Real local support"].map((item) => (
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
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
            <LocalTrustStrip />
            <LocalContactCard />
          </div>
        </div>
      </section>

      <section className="reveal-up bg-white section-space">
        <div className="container-shell">
          <SectionHeading eyebrow="Service families" title="Clear product pillars, not a noisy catalog." description="Core print, signage, design-led custom work, and local essentials organized into cleaner service groups." align="center" />
          <div className="mt-10">
            <CategoryDirectory />
          </div>
          <div className="mt-8">
            <BrandArchitecturePanel />
          </div>
        </div>
      </section>

      <section className="reveal-up bg-canvas section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-line/70 bg-white shadow-[0_28px_60px_rgba(18,17,16,0.08)]">
            <div className="relative aspect-[1.16/0.88]">
              <Image
                src={brandVisuals.premiumBusinessCards.src}
                alt={brandVisuals.premiumBusinessCards.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(20,18,16,0.42))]" />
              <div className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/84 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(18,17,16,0.08)] backdrop-blur-sm">
                Premium cards and stationery
              </div>
            </div>
          </div>
          <div className="story-panel">
            <p className="editorial-kicker">Print quality you can feel</p>
            <h2 className="mt-2 text-[2.45rem] font-black leading-[0.96] text-ink sm:text-[3.3rem]">Business cards and presentation pieces that look worth keeping.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate">
              Use premium cards, branded stationery, and polished handout pieces when the first impression matters as much as the information on the page.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Textured stock options", "Clean edge detail", "Better hand-feel for brand-first work"].map((item) => (
                <div key={item} className="premium-surface p-4 text-sm font-bold leading-6 text-ink">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/products/business-cards">Explore Business Cards</Button>
              <Button href="/quote-request" variant="secondary">Quote Premium Print</Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="reveal-up bg-canvas section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Choose your path"
            title="Print services that make the next step obvious."
            description="Start with a common product when you want speed, or move into a quote-led workflow when the job needs custom sizing, finishing, artwork review, or local advice."
            align="center"
          />
          <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="editorial-panel pl-7 pr-5 py-5">
              <p className="editorial-kicker">Best use cases</p>
              <h3 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Built for everyday essentials, marketing campaigns, and custom jobs that need real guidance.</h3>
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
          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-line/70 bg-[#f5f0ea] shadow-[0_26px_56px_rgba(18,17,16,0.08)]">
              <div className="relative aspect-[1.4/0.92]">
                <Image
                  src={brandVisuals.consultation.src}
                  alt={brandVisuals.consultation.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(20,18,16,0.34))]" />
                <div className="absolute bottom-5 left-5 max-w-[18rem] rounded-[1.35rem] border border-white/60 bg-white/86 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_28px_rgba(18,17,16,0.1)] backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Guidance before production</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-ink">Review samples, colours, timing, and materials with a real person before the job moves ahead.</p>
                </div>
              </div>
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
        </div>
      </section>

      <section className="reveal-up bg-canvas section-space">
        <div className="container-shell grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="story-panel pl-7">
            <p className="editorial-kicker">Why businesses switch</p>
            <h2 className="mt-2 text-[2.3rem] font-black leading-[0.98] text-ink">A cleaner alternative to the huge, hard-to-use print catalog.</h2>
            <p className="mt-3 text-sm leading-7 text-slate">
              PrintMe is built for customers who want broad print capability without digging through noisy menus. Start with the product when it is straightforward, switch to quote-first when the job gets custom, and use support when timing or artwork still needs guidance.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[1.85rem] border border-line/70 bg-white shadow-[0_20px_40px_rgba(18,17,16,0.08)] md:col-span-2">
              <div className="relative aspect-[1.75/0.88]">
                <Image
                  src={brandVisuals.paperStock.src}
                  alt={brandVisuals.paperStock.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(20,18,16,0.24))]" />
              </div>
            </div>
            {[
              "Business cards, flyers, brochures, postcards, and posters for everyday marketing",
              "Banners, signs, promotional print, and campaign bundles for events and local outreach",
              "Print-and-mail, design help, technical prints, and custom orders when the job needs more guidance",
              "Quote, upload, checkout, support, and account tools built into the same premium experience",
            ].map((item) => (
              <div key={item} className="premium-surface flex items-start gap-3 p-4">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm leading-6 text-slate">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-up bg-white section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="editorial-kicker">Craftsmanship and finishes</p>
            <h2 className="mt-2 text-[2.35rem] font-black leading-[0.98] text-ink sm:text-[3.1rem]">Materials, texture, and finishing choices presented more clearly.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate">
              Premium work depends on more than the layout. Stock weight, surface texture, embossing, and finish all change how the final piece feels in a customer’s hand.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                "Use textured and tactile stocks when the piece should feel more premium immediately.",
                "Choose quote-first support for embossed, specialty, or presentation-focused jobs.",
                "Ask before ordering if the finish needs to match a specific brand or use case.",
              ].map((item) => (
                <div key={item} className="signal-card">
                  <div className="flex items-start gap-3">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <p className="text-sm leading-6 text-slate">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-line/70 bg-canvas shadow-[0_22px_44px_rgba(18,17,16,0.08)]">
              <div className="relative aspect-[0.95/1]">
                <Image
                  src={brandVisuals.paperStock.src}
                  alt={brandVisuals.paperStock.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.8rem] border border-line/70 bg-canvas shadow-[0_22px_44px_rgba(18,17,16,0.08)] sm:mt-10">
              <div className="relative aspect-[0.95/1]">
                <Image
                  src={brandVisuals.embossedFinishes.src}
                  alt={brandVisuals.embossedFinishes.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-up section-band bg-canvas py-8">
        <div className="container-shell grid gap-4 md:grid-cols-3">
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
          <ReviewProofPanel />
        </div>
      </section>

      <section className="reveal-up bg-white pb-0 pt-6 lg:pt-8">
        <div className="container-shell">
          <LeadCtaPanel
            title="Have the file, the deadline, or just the rough idea?"
            description="Send the details now and PrintMe will help you choose the cleanest, fastest, most realistic path to a finished print job with local support before production begins."
            primaryLabel="Request a Quote"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>

      <MobileBottomCta />
    </>
  );
}
