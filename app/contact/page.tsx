import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact PrintMe Design in Scarborough for document printing, passport photos, flyers, banners, cheques, technical drawings, and custom print work.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Talk to PrintMe before your deadline gets tight"
        description="Call, visit our Scarborough shop, or send a quote request so we can help you choose the right print path before production starts."
        ctaLabel="Get My Quote"
      />
      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">{siteConfig.name}</h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-slate">
              <div>
                <p className="font-bold text-ink">Address</p>
                <p>{siteConfig.address}</p>
              </div>
              <div>
                <p className="font-bold text-ink">Phone</p>
                <a href={siteConfig.phoneHref} className="text-brand">
                  {siteConfig.phone}
                </a>
              </div>
              <div>
                <p className="font-bold text-ink">Fax</p>
                <p>{siteConfig.fax}</p>
              </div>
              <div>
                <p className="font-bold text-ink">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="text-brand">
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <p className="font-bold text-ink">Hours</p>
                {siteConfig.hours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/quote-request">Get My Quote</Button>
              <Button href={siteConfig.phoneHref} variant="secondary">
                Call PrintMe
              </Button>
            </div>
            <div className="mt-8 rounded-3xl border border-line bg-canvas p-5 text-sm leading-6 text-slate">
              <p className="font-bold text-ink">Service highlights</p>
              <p className="mt-2">Bring us your file, deadline, or print idea. We support document printing, passport photos, flyers, banners, envelopes, engineering drawing prints, manual cheques, and custom orders.</p>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <iframe
              title="PrintMe Design location map"
              src="https://www.google.com/maps?q=1585+Markham+Road+Unit+103,+Scarborough,+ON+M1B+2W1&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="border-t border-line p-6 text-sm leading-7 text-slate">
              <p className="font-bold text-ink">Visit the shop</p>
              <p className="mt-2">Use the map for directions to PrintMe at 1585 Markham Road Unit 103 in Scarborough.</p>
            </div>
          </div>
        </div>
        <div className="container-shell mt-8">
          <LeadCtaPanel
            title="Not sure what to ask for yet?"
            description="Send the file, size, deadline, or rough idea. PrintMe can help you clarify the right service before production."
            primaryLabel="Get My Quote"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>
    </>
  );
}
