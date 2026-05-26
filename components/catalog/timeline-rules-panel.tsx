import { timelineRules } from "@/data/experience";

export function TimelineRulesPanel() {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Turnaround rules</p>
      <h2 className="mt-2 text-3xl font-black text-ink">Business-set production windows</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        Customers do not choose arbitrary dates. PrintMe confirms timing using production rules, file readiness, and finishing requirements.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {timelineRules.map((rule) => (
          <article key={rule.title} className="rounded-[1.35rem] border border-line bg-canvas p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">{rule.title}</p>
            <p className="mt-3 text-2xl font-black text-ink">{rule.window}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{rule.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
