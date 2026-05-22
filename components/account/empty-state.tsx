import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center shadow-soft">
      <div className="mx-auto mb-5 h-2 w-16 rounded-full bg-brand" aria-hidden="true" />
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate">{description}</p>
      <Button href={ctaHref} className="mt-6">{ctaLabel}</Button>
    </div>
  );
}
