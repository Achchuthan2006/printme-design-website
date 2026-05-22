import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductCategory } from "@/types";

export function CategoryHero({ category }: { category: ProductCategory }) {
  return (
    <section className="bg-white section-space">
      <div className="container-shell">
        <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: category.title }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge>{category.shortTitle}</Badge>
            <h1 className="mt-4 text-balance text-5xl font-black leading-tight text-ink">{category.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate">{category.description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/quote-request">Request Help</Button>
              <Button href="/artwork-guidelines" variant="secondary">Artwork Guidelines</Button>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-canvas p-6 shadow-soft">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Icon name={category.icon} className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-ink">{category.highlight}</h2>
            <p className="mt-4 text-sm leading-7 text-slate">{category.turnaroundNote}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {category.trustNotes.map((note) => (
                <div key={note} className="rounded-md bg-white p-3 text-xs font-bold text-ink shadow-soft">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
