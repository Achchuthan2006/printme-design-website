export function QuotePricingGuidance({ serviceSlug }: { serviceSlug?: string }) {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Pricing guidance</p>
      <h3 className="mt-2 text-xl font-black text-ink">What helps PrintMe quote this accurately</h3>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate">
        <p>Share quantity, size, deadline, and whether the artwork is ready.</p>
        <p>Rush requests and custom finishing are usually reviewed before pricing is finalized.</p>
        {serviceSlug ? <p>Requested service: <span className="font-black text-ink">{serviceSlug}</span></p> : null}
      </div>
    </section>
  );
}
