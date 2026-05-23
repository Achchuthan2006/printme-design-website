import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductCategory } from "@/types";

export function CategoryHero({ category }: { category: ProductCategory }) {
  return (
    <section className="relative overflow-hidden bg-white section-space">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.08),transparent_28rem),radial-gradient(circle_at_86%_16%,rgba(18,17,16,0.04),transparent_22rem)]" aria-hidden="true" />
      <div className="container-shell relative">
        <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: category.title }]} />
        <div className="hero-panel mt-8 px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge>{category.shortTitle}</Badge>
              <h1 className="display-title mt-4 text-balance text-[3rem] font-black leading-[0.93] sm:text-[4rem]">{category.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate">{category.description}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/quote-request">Get My Quote</Button>
                <Button href="/artwork-guidelines" variant="secondary">Check Artwork First</Button>
              </div>
            </div>
            <div className="premium-surface bg-canvas p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand shadow-soft">
                <Icon name={category.icon} className="h-7 w-7" />
              </div>
              <h2 className="display-title mt-5 text-[2rem] font-black leading-[0.96]">{category.highlight}</h2>
              <p className="mt-4 text-sm leading-7 text-slate">{category.turnaroundNote}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {category.trustNotes.map((note) => (
                  <div key={note} className="rounded-[1.15rem] border border-line/80 bg-white p-3 text-xs font-bold uppercase tracking-[0.08em] text-ink shadow-soft">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
