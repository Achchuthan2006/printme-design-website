import { paymentGuidance } from "@/data/experience";

export function PaymentClarityPanel() {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Payment clarity</p>
      <h2 className="mt-2 text-3xl font-black text-ink">{paymentGuidance.heading}</h2>
      <div className="mt-6 grid gap-3">
        {paymentGuidance.points.map((point) => (
          <div key={point} className="signal-card text-sm leading-6 text-slate">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}
