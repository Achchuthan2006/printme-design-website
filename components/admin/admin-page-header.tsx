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
    <header className="hero-panel p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="editorial-kicker">{eyebrow}</p>
          <h1 className="display-title mt-3 text-[2.7rem] font-black leading-[0.94] md:text-[3.4rem]">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">{description}</p>
        </div>
        {actionHref && actionLabel ? <Button href={actionHref}>{actionLabel}</Button> : null}
      </div>
    </header>
  );
}
