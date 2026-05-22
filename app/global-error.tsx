"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-[#f7f3ee] px-4 font-sans text-[#171717]">
          <section className="max-w-xl rounded-2xl border border-[#e9e1d8] bg-white p-8 text-center shadow-[0_24px_80px_rgba(19,19,19,0.12)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d94620]">PrintMe system error</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">We hit a temporary issue.</h1>
            <p className="mt-4 text-sm leading-7 text-[#67625e]">
              Refresh the page or contact PrintMe directly if you need a quote, order update, or artwork help right away.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-xl bg-[#d94620] px-5 py-3 text-sm font-extrabold text-white"
            >
              Reload Page
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
