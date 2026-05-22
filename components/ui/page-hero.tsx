import { Button } from "@/components/ui/button";

interface PageHeroProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PageHero({ title, description, ctaLabel = "Request a Quote", ctaHref = "/quote-request" }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-panel">
      <div className="container-shell section-space">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand">PrintMe Design</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">{description}</p>
          <div className="mt-8">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
