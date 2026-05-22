import { PageHero } from "@/components/ui/page-hero";
import { PrintReadyChecklist } from "@/components/upload/print-ready-checklist";
import { artworkGuidelines, uploadWorkflowStatuses } from "@/data/support";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Artwork Guidelines",
  description: "Print-ready artwork guidance for file types, CMYK, bleed, safe margins, image resolution, and upload checks.",
  path: "/artwork-guidelines",
});

export default function ArtworkGuidelinesPage() {
  return (
    <>
      <PageHero
        title="Set up artwork that prints cleanly"
        description="Use these checks to reduce delays, avoid rework, and help PrintMe move your file into production with more confidence."
        ctaLabel="Upload My Artwork"
        ctaHref="/quote-request#upload"
      />
      <section className="section-space bg-canvas">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {artworkGuidelines.map((item) => (
              <article key={item.title} className="rounded-lg border border-line bg-white p-6 shadow-soft">
                <h2 className="text-xl font-black text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <PrintReadyChecklist />
            <section className="rounded-lg border border-line bg-ink p-6 text-white shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Artwork workflow</p>
              <h2 className="mt-2 text-2xl font-black">What PrintMe checks after upload</h2>
              <div className="mt-5 space-y-4">
                {uploadWorkflowStatuses.map((item, index) => (
                  <article key={item.status} className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-black text-white">
                      {index + 1}. {item.status}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
