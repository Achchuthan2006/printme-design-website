import { Button } from "@/components/ui/button";

interface PageHeroProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PageHero({ title, description, ctaLabel = "Get My Quote", ctaHref = "/quote-request" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-soft/50 to-transparent" aria-hidden="true" />
      <div className="container-shell section-space relative">
        <div className="max-w-4xl">
          <p className="hero-in text-xs font-black uppercase tracking-[0.24em] text-brand">PrintMe Design</p>
          <h1 className="hero-in mt-4 text-balance text-4xl font-black leading-[1.02] tracking-[-0.04em] text-ink [--delay:80ms] sm:text-6xl">{title}</h1>
          <p className="hero-in mt-5 max-w-2xl text-base leading-8 text-slate [--delay:160ms] sm:text-lg">{description}</p>
          <div className="mt-8">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
