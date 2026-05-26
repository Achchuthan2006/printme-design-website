import { reviewHighlights } from "@/data/experience";
import { testimonials } from "@/lib/site";

export function ReviewProofPanel() {
  return (
    <section className="surface-card p-6">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="editorial-kicker">Reviews and trust</p>
          <h2 className="mt-2 text-3xl font-black text-ink">{reviewHighlights.label}</h2>
          <p className="mt-4 text-5xl font-black text-ink">{reviewHighlights.rating}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {reviewHighlights.stats.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-line bg-canvas p-4">
                <p className="text-xl font-black text-ink">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviewHighlights.proofPoints.map((point) => (
            <div key={point} className="signal-card text-sm leading-6 text-slate">
              {point}
            </div>
          ))}
          {testimonials.slice(0, 2).map((item) => (
            <article key={item.name} className="rounded-[1.35rem] border border-line bg-white p-5 shadow-[0_14px_24px_rgba(18,17,16,0.05)]">
              <p className="text-sm leading-7 text-slate">{item.quote}</p>
              <p className="mt-4 text-sm font-black text-ink">{item.name}</p>
              <p className="text-xs text-slate">{item.company}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
