import { brandArchitectureRecommendation } from "@/data/experience";
import { Button } from "@/components/ui/button";

export function BrandArchitecturePanel() {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Site structure</p>
      <h2 className="mt-2 text-3xl font-black text-ink">{brandArchitectureRecommendation.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">{brandArchitectureRecommendation.description}</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {brandArchitectureRecommendation.pillars.map((pillar) => (
          <article key={pillar.title} className="rounded-[1.35rem] border border-line bg-canvas p-4">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-brand">{pillar.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate">{pillar.detail}</p>
            <div className="mt-4">
              <Button href={pillar.href} variant="secondary" className="px-4 py-2 text-[11px]">
                Explore path
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
