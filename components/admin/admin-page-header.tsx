import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  eyebrow = "PrintMe operations",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <header className="rounded-2xl border border-line/80 bg-white p-6 shadow-soft">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-ink md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">{description}</p>
        </div>
        {actionHref && actionLabel ? <Button href={actionHref}>{actionLabel}</Button> : null}
      </div>
    </header>
  );
}
