"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/account/auth-provider";
import { StatusBadge } from "@/components/account/status-badge";
import { demoFiles, demoInvoices, demoOrders, demoQuotes } from "@/data/account";

export function AccountShell() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "PrintMe customer";
  const widgets = [
    { title: "Open Orders", value: String(demoOrders.filter((order) => order.status !== "completed").length), description: "Track active jobs and know what needs review next." },
    { title: "Saved Quotes", value: String(demoQuotes.length), description: "Keep quote requests organized for faster approvals." },
    { title: "Uploaded Files", value: String(demoFiles.length), description: "Keep artwork ready for quotes, orders, and reorders." },
    { title: "Invoices", value: String(demoInvoices.length), description: "Access billing records as the order system grows." },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Welcome back</p>
            <h1 className="mt-2 text-3xl font-black text-ink">{displayName}</h1>
            <p className="mt-2 text-sm leading-6 text-slate">
              Keep your quotes, orders, artwork files, invoices, and future reorders organized in one place.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products">Start My Order</Button>
            <Button href="/quote-request" variant="secondary">Get My Quote</Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget) => (
          <article key={widget.title} className="premium-card rounded-2xl border border-line/90 bg-white p-5 shadow-soft hover:border-brand/25 hover:shadow-card">
            <p className="text-sm font-bold text-slate">{widget.title}</p>
            <p className="mt-3 text-3xl font-black text-ink">{widget.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{widget.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-ink">Recent orders</h2>
            <Button href="/account/orders" variant="secondary" className="px-4 py-2 text-xs">Review Orders</Button>
          </div>
          <div className="mt-5 space-y-4">
            {demoOrders.slice(0, 2).map((order) => (
              <article key={order.id} className="rounded-2xl border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-ink">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-slate">{order.items.join(", ")} / {order.date}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-ink">Recent quotes</h2>
            <Button href="/account/quotes" variant="secondary" className="px-4 py-2 text-xs">Review Quotes</Button>
          </div>
          <div className="mt-5 space-y-4">
            {demoQuotes.map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-ink">{quote.service}</p>
                    <p className="mt-1 text-sm text-slate">{quote.summary}</p>
                  </div>
                  <StatusBadge status={quote.status} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-6 text-white shadow-card">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-black">Next time should be faster.</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Saved files, previous order details, invoice downloads, and reorder actions are structured so repeat jobs can become easier over time.
            </p>
          </div>
          <Button href="/support">Get Support</Button>
        </div>
      </section>
    </div>
  );
}
