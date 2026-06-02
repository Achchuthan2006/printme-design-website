import { PageHero } from "@/components/ui/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact PrintMe",
  description: "Contact PrintMe Design in Scarborough for document printing, passport photos, flyers, banners, cheques, technical drawings, and custom print work.",
  path: "/contact",
  keywords: ["print shop contact scarborough", "print shop address scarborough", "local print shop phone number"],
});

export default function ContactPage() {
  const contactModes = [
    { label: "Call", value: siteConfig.phone, detail: "Best for urgent timing, passport photos, or quick production questions.", href: siteConfig.phoneHref, icon: "phone" },
    { label: "Email", value: siteConfig.email, detail: "Useful when you want to send written details or follow up after a quote.", href: `mailto:${siteConfig.email}`, icon: "document" },
    { label: "Visit", value: siteConfig.shortAddress, detail: "In-store pickup, local help, and on-site questions in Scarborough.", href: "https://www.google.com/maps?q=1585+Markham+Road+Unit+103,+Scarborough,+ON+M1B+2W1", icon: "store" },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([{ label: "Contact" }]),
          buildLocalBusinessSchema({
            path: "/contact",
            description: "Contact and location details for PrintMe's Scarborough print shop.",
          }),
        ]}
      />
      <PageHero
        title="Call, visit, or message PrintMe before the deadline gets tight."
        description="Contact our Scarborough print shop for quotes, file questions, passport photo availability, pickup details, or help choosing the right print path."
        ctaLabel="Request a Quote"
        eyebrow="Contact"
        highlights={["Call for urgent timing", "Visit the Scarborough shop", "Quote requests for custom jobs"]}
      />
      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-6 sm:p-8">
            <p className="editorial-kicker">Contact details</p>
            <h2 className="display-title mt-3 text-[2.1rem] font-black leading-[0.96]">{siteConfig.name}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {contactModes.map((item) => (
                <a key={item.label} href={item.href} className="signal-card transition hover:border-brand/25 hover:bg-brand-soft/30">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                    <Icon name={item.icon} className="h-4.5 w-4.5" />
                  </span>
                  <p className="mt-4 text-sm font-black text-ink">{item.label}</p>
                  <p className="mt-1 text-xs font-bold text-slate">{item.value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate">{item.detail}</p>
                </a>
              ))}
            </div>
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
            <div className="mt-6 rounded-[1.35rem] border border-line bg-canvas p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">Why customers call first</p>
              <p className="mt-2 text-sm leading-6 text-slate">The fastest way to confirm rush timing, passport photo availability, pickup details, or whether a custom print job should start with a quote.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/quote-request">Request a Quote</Button>
              <Button href={siteConfig.phoneHref} variant="secondary">
                Call PrintMe
              </Button>
            </div>
            <div className="mt-8 rounded-[1.5rem] border border-line bg-canvas p-5 text-sm leading-6 text-slate">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand">Service highlights</p>
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand">Visit the shop</p>
              <p className="mt-2">Use the map for directions to PrintMe at 1585 Markham Road Unit 103 in Scarborough.</p>
            </div>
          </div>
        </div>
        <div className="container-shell mt-8">
          <LeadCtaPanel
            title="Not sure what to ask for yet?"
            description="Send the file, size, deadline, or rough idea. PrintMe can help you clarify the right service before production."
            primaryLabel="Request a Quote"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>
    </>
  );
}
