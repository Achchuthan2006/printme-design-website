import { AccountOrder, AccountQuote, AccountReorderTemplate, AccountSavedDesign } from "@/types";

export function ReturningCustomerIntelligence({
  orders,
  quotes,
  reorders,
  savedDesigns,
}: {
  orders: AccountOrder[];
  quotes: AccountQuote[];
  reorders: AccountReorderTemplate[];
  savedDesigns: AccountSavedDesign[];
}) {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Returning customer</p>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        {[
          { label: "Orders", value: orders.length },
          { label: "Quotes", value: quotes.length },
          { label: "Reorders", value: reorders.length },
          { label: "Saved designs", value: savedDesigns.length },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.2rem] border border-line bg-canvas p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
