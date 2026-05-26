"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface SupportShortcut {
  title: string;
  detail: string;
  href: string;
  cta: string;
  icon: string;
}

export function AccountSupportHub({
  title = "Need help with this account area?",
  description = "Use the right support path for quotes, orders, files, invoices, or repeat jobs so PrintMe can respond faster.",
  shortcuts,
}: {
  title?: string;
  description?: string;
  shortcuts: SupportShortcut[];
}) {
  return (
    <section className="surface-card p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Support hub</p>
      <h2 className="mt-2 text-2xl font-black text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate">{description}</p>
      <div className="mt-5 grid gap-3">
        {shortcuts.map((item) => (
          <article key={item.title} className="rounded-[1.2rem] border border-line/90 bg-canvas p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-white text-brand">
                <Icon name={item.icon} className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
                <Button href={item.href} variant="secondary" className="mt-4 px-4 py-2 text-xs">
                  {item.cta}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
