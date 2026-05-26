"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { supportChatOpenEvent } from "@/lib/chat";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "assistant" | "customer";
  text: string;
  tone?: "default" | "soft";
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  response: string;
  href?: string;
  hrefLabel?: string;
}

const quickActions: QuickAction[] = [
  {
    id: "quote",
    label: "Get a Quote",
    prompt: "I need a quote for a print job.",
    response: "The fastest path is to send the service, quantity, deadline, and whether your artwork is ready. PrintMe will review the details and reply with the clearest next step.",
    href: "/quote-request",
    hrefLabel: "Open quote request",
  },
  {
    id: "turnaround",
    label: "Ask About Turnaround Time",
    prompt: "How fast can this be ready?",
    response: "Turnaround depends on the product, file readiness, quantity, and finishing. Rush-friendly jobs are reviewed first, and we will confirm what is realistic before you commit.",
  },
  {
    id: "upload-help",
    label: "Upload Help",
    prompt: "What files should I upload?",
    response: "PDF is preferred, but you can also send images, design files, or a ZIP package. If anything needs cleanup, PrintMe can flag it before production begins.",
    href: "/artwork-guidelines",
    hrefLabel: "Review file guidelines",
  },
  {
    id: "business-cards",
    label: "Business Card Help",
    prompt: "I need help choosing business card options.",
    response: "If you want standard business cards, you can order online now. If you need specialty stock, double-sided layouts, or design help, quote review is the safest path.",
    href: "/products/business-cards",
    hrefLabel: "View business cards",
  },
  {
    id: "banners",
    label: "Banner Printing Help",
    prompt: "I have questions about banner printing.",
    response: "For banners, the most helpful details are size, indoor or outdoor use, finishing needs, deadline, and whether delivery matters. PrintMe can help confirm the right material first.",
    href: "/products/banners",
    hrefLabel: "View banner options",
  },
  {
    id: "passport",
    label: "Passport Photo Questions",
    prompt: "Do you handle passport photos?",
    response: "Yes. Passport and ID photos are handled in store. It is best to call ahead if timing matters or if you need to confirm special document requirements.",
    href: "/contact",
    hrefLabel: "Plan your visit",
  },
  {
    id: "track",
    label: "Track My Order",
    prompt: "Can I track my order?",
    response: "You can use the order status page for guided progress lookup, then contact PrintMe if timing, files, or pickup details still need a faster answer.",
    href: "/order-status",
    hrefLabel: "Check order status",
  },
  {
    id: "support",
    label: "Speak to Support",
    prompt: "I want to speak with someone.",
    response: `You can call ${siteConfig.phone} or email ${siteConfig.email}. If you already have an order or quote, include the service and your deadline so the team can help faster.`,
    href: "/support",
    hrefLabel: "Open support page",
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi, I'm the PrintMe help desk. I can point you to quotes, turnaround guidance, upload help, and the best next step for your print job.",
  },
  {
    id: "welcome-soft",
    role: "assistant",
    tone: "soft",
    text: "If your project is urgent or custom, choose a quick question below and I'll guide you there.",
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const suggestedActions = useMemo(
    () => quickActions.filter((action) => action.id !== activeAction).slice(0, 4),
    [activeAction],
  );

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(supportChatOpenEvent, handleOpen);
    return () => window.removeEventListener(supportChatOpenEvent, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function handleQuickAction(action: QuickAction) {
    setOpen(true);
    setActiveAction(action.id);
    setMessages((current) => [
      ...current,
      { id: `${action.id}-prompt`, role: "customer", text: action.prompt },
      { id: `${action.id}-response`, role: "assistant", text: action.response },
    ]);
  }

  return (
    <>
      <div className="fixed bottom-24 right-4 z-[75] md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="printme-chat-widget"
          className="group inline-flex min-h-14 items-center gap-3 rounded-full border border-white/10 bg-[linear-gradient(180deg,#1e1a18_0%,#121110_100%)] px-4 py-3 text-left text-white shadow-[0_28px_68px_rgba(22,19,17,0.3)] transition hover:-translate-y-0.5 hover:bg-ink/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ef6a46_0%,#d94620_70%,#b73314_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_30px_rgba(217,70,32,0.28)]">
            <Icon name="chat" className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/65">Need help?</span>
            <span className="mt-0.5 block text-sm font-black">Ask PrintMe</span>
          </span>
        </button>
      </div>

      <aside
        id="printme-chat-widget"
        role="dialog"
        aria-modal="false"
        aria-label="PrintMe support chat"
        className={cn(
          "fixed bottom-[5.75rem] right-4 z-[74] flex w-[min(100%-2rem,24rem)] flex-col overflow-hidden rounded-[1.9rem] border border-white/75 bg-white/86 shadow-[0_42px_96px_rgba(22,19,17,0.2)] backdrop-blur-[18px] transition-all duration-300 md:bottom-24 md:right-6",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="border-b border-line/70 bg-[linear-gradient(135deg,rgba(255,241,236,0.98),rgba(255,255,255,0.96))] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">PrintMe support</p>
              <h2 className="mt-1 text-lg font-black text-ink">Quick answers while you browse</h2>
              <p className="mt-1 text-xs leading-5 text-slate">Quotes, uploads, turnaround, pickup, and custom print guidance.</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
              className="rounded-[1.1rem] border border-white/90 bg-white px-3 py-2 text-xs font-black text-slate transition hover:border-brand/20 hover:text-brand"
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[25rem] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fff_0%,#fffaf7_100%)] p-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === "assistant" ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-[88%] rounded-[1.25rem] px-4 py-3 text-sm leading-6 shadow-soft",
                  message.role === "assistant"
                    ? message.tone === "soft"
                      ? "border border-line/80 bg-white/92 text-slate"
                      : "bg-ink text-white shadow-[0_16px_28px_rgba(18,17,16,0.12)]"
                    : "bg-brand text-white shadow-[0_16px_30px_rgba(217,70,32,0.18)]",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line/70 bg-white p-4">
          <div className="focus-band p-3 shadow-[0_10px_22px_rgba(18,17,16,0.04)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Support modes</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { title: "Quote help", detail: "Best for custom jobs, pricing, and rush planning." },
                { title: "Order help", detail: "Best for status, pickup, payment, and production updates." },
                { title: "File help", detail: "Best for uploads, proofing, bleed, and print readiness." },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.05rem] border border-white/80 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <p className="text-xs font-black text-ink">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Quick questions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="rounded-full border border-white/85 bg-white/88 px-3 py-2 text-xs font-black text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-brand/20 hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {action.label}
              </button>
            ))}
          </div>

          {activeAction ? (
            <div className="mt-4 focus-band p-3 shadow-[0_10px_22px_rgba(18,17,16,0.04)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Next best step</p>
              <div className="mt-3 flex flex-col gap-2">
                {quickActions
                  .filter((action) => action.id === activeAction && action.href && action.hrefLabel)
                  .map((action) => (
                    <Link
                      key={action.id}
                      href={action.href!}
                      className="rounded-[1.15rem] bg-white px-4 py-3 text-sm font-black text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition hover:bg-brand-soft"
                    >
                      {action.hrefLabel}
                    </Link>
                  ))}
                <Button href={siteConfig.phoneHref} variant="secondary" className="w-full">
                  Call PrintMe
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link href="/quote-request" className="rounded-[1.15rem] border border-white/80 bg-white px-4 py-3 text-sm font-black text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition hover:border-brand/20 hover:bg-brand-soft hover:text-brand">
              Start a quote
            </Link>
            <Link href="/support" className="rounded-[1.15rem] border border-white/80 bg-white px-4 py-3 text-sm font-black text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition hover:border-brand/20 hover:bg-brand-soft hover:text-brand">
              Full support page
            </Link>
          </div>
          <div className="mt-3 rounded-[1rem] border border-white/80 bg-white/84 px-3 py-3 text-xs leading-5 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
            If your deadline is today, call the shop directly for the fastest answer.
          </div>
        </div>
      </aside>
    </>
  );
}
