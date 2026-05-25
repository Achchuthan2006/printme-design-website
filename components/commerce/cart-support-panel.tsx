"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { openSupportChat } from "@/lib/chat";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CartSupportPanelProps {
  compact?: boolean;
  className?: string;
}

const supportPoints = [
  {
    icon: "shield",
    title: "Secure payment",
    detail: "Stripe handles online payment and PrintMe reviews files before production starts.",
  },
  {
    icon: "clock",
    title: "Turnaround confirmed",
    detail: "Rush timing, pickup, and delivery details are checked before your job moves forward.",
  },
  {
    icon: "upload",
    title: "Artwork help available",
    detail: "Send files now or after checkout. We can flag anything that needs attention before print.",
  },
  {
    icon: "check",
    title: "Clear next steps",
    detail: "If an item needs review, we confirm pricing, turnaround, and fulfillment before your order moves ahead.",
  },
];

export function CartSupportPanel({ compact = false, className }: CartSupportPanelProps) {
  return (
    <section className={cn("section-frame p-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">PrintMe reassurance</p>
          <h3 className="mt-2 text-lg font-black text-ink">
            {compact ? "Need a quick answer before checkout?" : "A few details customers usually want confirmed"}
          </h3>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-white text-brand shadow-soft">
          <Icon name="chat" className="h-5 w-5" />
        </span>
      </div>

      <div className={cn("mt-4 grid gap-3", compact ? "sm:grid-cols-1" : "sm:grid-cols-3")}>
        {supportPoints.map((point) => (
          <div key={point.title} className="rounded-[1.2rem] border border-white/90 bg-white/94 p-3 shadow-[0_10px_24px_rgba(18,17,16,0.045)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-brand/10 bg-brand-soft text-brand">
                <Icon name={point.icon} className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-black text-ink">{point.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate">{point.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={cn("mt-4 flex gap-3", compact ? "flex-col" : "flex-col sm:flex-row")}>
        <Button type="button" variant="secondary" className="flex-1" onClick={openSupportChat}>
          Ask a Print Question
        </Button>
        <Button href={siteConfig.phoneHref} className="flex-1">
          Call {siteConfig.phone}
        </Button>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate">
        Custom sizing, file corrections, and quote-only items are always reviewed by the team before production is locked in.
      </p>
    </section>
  );
}
