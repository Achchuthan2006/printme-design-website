import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About",
  description: "Learn more about PrintMe Design, a Scarborough print shop with 20+ years of experience, custom solutions, fast turnaround, and personalized service.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="A Scarborough print shop with 20+ years of hands-on experience"
        description="PrintMe Design is a one-stop local print partner for documents, marketing materials, business stationery, packaging support, technical prints, and custom orders."
        eyebrow="About PrintMe"
        highlights={["20+ years of print experience", "Local Scarborough support", "Practical guidance before production"]}
      />
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card p-8">
              <p className="editorial-kicker">{siteConfig.tagline}</p>
              <h2 className="display-title mt-4 text-[2.35rem] font-black leading-[0.95]">Modern service built on real printing experience</h2>
              <p className="mt-5 text-base leading-8 text-slate">
                {siteConfig.name} brings more than two decades of print-industry experience to customers across Scarborough, Toronto, and the GTA. The shop supports everyday document printing, passport photos, flyers, envelopes, banners, engineering drawing prints, manual cheques, and custom print jobs.
              </p>
              <p className="mt-5 text-base leading-8 text-slate">
                The focus is simple: high-quality output, custom solutions, fast turnaround, close attention to detail, and service that feels personal. Whether the project is routine or unusual, PrintMe helps shape the right approach before the job goes to print.
              </p>
            </div>
            <div className="grid gap-6">
              {[
                {
                  title: "Customer-first support",
                  copy: "We clarify specs, review timing, and recommend the right print path before production begins.",
                },
                {
                  title: "Custom print solutions",
                  copy: "From marketing materials to business stationery and specialty requests, we help tailor the job to your needs.",
                },
                {
                  title: "Local convenience",
                  copy: `Our location at ${siteConfig.shortAddress} makes pickup simple, with delivery options available for qualifying orders.`,
                },
              ].map((item) => (
                <div key={item.title} className="surface-card p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">Brand promise</p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
