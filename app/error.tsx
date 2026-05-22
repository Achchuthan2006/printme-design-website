"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-space bg-cream">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-8 text-center shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Something went wrong</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-ink">We could not load this page.</h1>
          <p className="mt-4 text-sm leading-7 text-slate">
            Please try again. If this keeps happening, call PrintMe and we can help with your quote, order, or artwork request directly.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(217,70,32,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Try Again
            </button>
            <Button href="/contact" variant="secondary">Contact PrintMe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
