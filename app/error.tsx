"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <div className="hero-panel mx-auto max-w-2xl p-8 text-center">
          <p className="editorial-kicker">Something went wrong</p>
          <h1 className="display-title mt-3 text-[2.7rem] font-black leading-[0.94]">We could not load this page.</h1>
          <p className="mt-4 text-sm leading-7 text-slate">
            Please try again. If this keeps happening, call PrintMe and we can help with your quote, order, or artwork request directly.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={reset}
              variant="brand"
            >
              Try Again
            </Button>
            <Button href="/contact" variant="secondary">Contact PrintMe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
