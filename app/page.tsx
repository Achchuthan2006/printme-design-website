import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { MobileBottomCta } from "@/components/sections/mobile-bottom-cta";
import { HeroPrintComposition } from "@/components/sections/print-product-visual";
import { ServiceCard } from "@/components/sections/service-card";
import { TrustBadge } from "@/components/sections/trust-badge";
import { buildMetadata } from "@/lib/metadata";
import { processSteps, services, siteConfig, testimonials, whyChooseUs } from "@/lib/site";

const heroTrust = [
  { icon: "store", title: `Serving ${siteConfig.serviceArea}` },
  { icon: "check", title: siteConfig.experience },
];

const serviceHighlights = [
  { icon: "clock", title: "Fast Turnaround", copy: "Rush-friendly service for ready-to-print jobs and business orders." },
  { icon: "store", title: "Easy Pickup", copy: "Visit our Scarborough shop when your order is ready." },
  { icon: "van", title: "Local Delivery", copy: "Delivery options across Scarborough, Toronto, and surrounding areas." },
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
      <section className="overflow-hidden bg-white">
        <div className="container-shell grid gap-10 pb-12 pt-12 lg:grid-cols-[0.93fr_1.07fr] lg:items-center lg:pb-16 lg:pt-14">
          <div>
            <p className="hero-in text-[11px] font-black uppercase tracking-[0.22em] text-brand [--delay:40ms]">
              Local printing. Fast. Reliable.
            </p>
            <h1 className="hero-in mt-4 max-w-2xl text-balance text-4xl font-black leading-[0.98] text-ink [--delay:120ms] sm:text-5xl lg:text-[64px]">
              Your One-Stop Print Shop in Scarborough & Toronto.
            </h1>
            <p className="hero-in mt-5 max-w-xl text-sm leading-7 text-slate [--delay:210ms] sm:text-base">
              PrintMe combines 20+ years of printing experience with personalized service, fast turnaround,
              and custom solutions for documents, flyers, banners, passport photos, business stationery, and more.
            </p>
            <div className="hero-in mt-7 flex flex-col gap-3 [--delay:300ms] sm:flex-row">
              <Button href="/quote-request">
                Request a Quote
                <span aria-hidden="true" className="ml-2">-&gt;</span>
              </Button>
              <Button href="/services" variant="secondary">
                View Our Services
              </Button>
            </div>
            <div className="hero-in mt-7 flex flex-col gap-3 text-xs font-bold text-slate [--delay:390ms] sm:flex-row sm:items-center sm:gap-7">
              {heroTrust.map((item) => (
                <div key={item.title} className="flex items-center gap-2">
                  <Icon name={item.icon} className="h-4 w-4 text-brand" />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <HeroPrintComposition />
        </div>
      </section>

      <section className="reveal-up border-y border-line bg-white py-8">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_24px_rgba(217,70,32,0.25)]">
              <Icon name="document" className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink">About PrintMe</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate">
                Make your styles with us. PrintMe is a local Scarborough print partner helping businesses,
                organizations, and individuals produce marketing materials, business stationery, packaging pieces,
                technical prints, and custom jobs with craftsmanship, consistency, and practical advice.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["20+ years of experience", "Custom print solutions", "Fast turnaround", "Personalized local service"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-ink">
                <Icon name="check" className="h-4 w-4 text-brand" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="reveal-up bg-canvas section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="What we print"
            title="Our Featured Services"
            description="Choose from practical business essentials, document services, event materials, signage, technical prints, manual cheques, and custom design-to-print orders."
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
              View All Services
            </Button>
          </div>
        </div>
      </section>

      <section className="reveal-up bg-white section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand">Why choose PrintMe Design</p>
            <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-ink">
              Quality Prints. Local Care.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate">
              We pair industry experience with careful production, clear communication, and practical recommendations
              so your project feels handled from the first quote to final pickup.
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

      <section className="reveal-up border-y border-line bg-canvas py-10">
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
            title="3 Simple Steps"
            description="Request your project, approve the details, and choose pickup or local delivery."
            align="center"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="group premium-card relative rounded-lg border border-line bg-white p-5 shadow-soft hover:border-brand/35 hover:shadow-card">
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
            eyebrow="What our customers say"
            title="Local customers trust PrintMe Design"
            description="Placeholder testimonials written in the tone of local business customers. Replace with verified reviews when available."
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
          <div className="cta-sheen relative overflow-hidden rounded-lg bg-brand p-8 text-white shadow-card sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-balance text-3xl font-black leading-tight sm:text-4xl">
                  Ready to bring your ideas to life?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/82">
                  Get a quote today for documents, flyers, banners, passport photos, cheques, technical drawings, or a custom print job.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-white/82">
                  {["Fast response", "No hidden fees", "100% satisfaction"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <Icon name="check" className="h-4 w-4" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <Button href="/quote-request" variant="secondary" className="bg-white px-6">
                Request a Quote
                <span aria-hidden="true" className="ml-2">-&gt;</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MobileBottomCta />
    </>
  );
}
