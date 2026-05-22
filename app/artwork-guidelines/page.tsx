import { PageHero } from "@/components/ui/page-hero";
import { artworkGuidelines } from "@/data/support";
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
        title="Artwork guidelines for cleaner print results"
        description="Prepare files with the right format, colour mode, bleed, safe margin, and resolution before upload."
      />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {artworkGuidelines.map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-white p-6 shadow-soft">
              <h2 className="text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
