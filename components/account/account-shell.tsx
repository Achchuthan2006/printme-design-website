"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/components/account/auth-provider";
import { StatusBadge } from "@/components/account/status-badge";
import { accountHealthSummary, accountOrderProgress, accountSupportShortcuts, demoActivity, demoAddresses, demoFiles, demoInvoices, demoOrders, demoProfile, demoQuotes, demoReorders } from "@/data/account";
import { SummaryStrip } from "@/components/platform/summary-strip";
import { StatusTimeline } from "@/components/platform/status-timeline";
import { AccountActivityFeed } from "@/components/account/account-activity-feed";
import { AddressBookPanel } from "@/components/account/address-book-panel";
import { ReorderStudio } from "@/components/account/reorder-studio";
import { AccountSupportHub } from "@/components/account/account-support-hub";

export function AccountShell() {
  const { user, configured } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "PrintMe customer";
  const widgets = [
    { title: "Open Orders", value: String(demoOrders.filter((order) => order.status !== "completed").length), description: "Track active jobs and know what needs review next." },
    { title: "Saved Quotes", value: String(demoQuotes.length), description: "Keep quote requests organized for faster approvals." },
    { title: "Uploaded Files", value: String(demoFiles.length), description: "Keep artwork ready for quotes, orders, and reorders." },
    { title: "Invoices", value: String(demoInvoices.length), description: "Access billing records as the order system grows." },
  ];
  const quickActions = [
    { title: "Start a reorder-friendly quote", detail: "Use the quote flow when you want a familiar job priced again with updated timing or quantity.", href: "/quote-request", icon: "document" },
    { title: "Upload or organize artwork", detail: "Keep files attached to the right order, quote, or future repeat job.", href: "/account/files", icon: "upload" },
    { title: "Talk to support", detail: "Ask about pickup timing, status, invoices, or the next production step.", href: "/support", icon: "chat" },
  ];
  const featuredOrder = demoOrders[0];
  const featuredTimeline = accountOrderProgress[featuredOrder.id] ?? [];

  return (
    <div className="space-y-6">
      <section className="hero-panel p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="editorial-kicker">Welcome back</p>
            <h1 className="display-title mt-2 text-[2.6rem] font-black">{displayName}</h1>
            <p className="mt-3 text-sm leading-6 text-slate">
              Keep your quotes, orders, artwork files, invoices, and future reorders organized in one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="value-chip">{demoProfile.companyName}</span>
              <span className="value-chip">{demoProfile.email}</span>
              <span className="value-chip">{demoProfile.phone}</span>
            </div>
            <div className="mt-4 rounded-[1.3rem] border border-line/80 bg-canvas px-4 py-3 text-xs leading-5 text-slate">
              <span className="font-black text-ink">Current dashboard state:</span>{" "}
              {configured
                ? "account access is live, but the overview cards below still use preview data until full order, quote, invoice, and upload history are connected."
                : "this is a preview dashboard until Supabase auth and persisted customer data are fully configured."}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products">Start My Order</Button>
            <Button href="/quote-request" variant="secondary">Request a Quote</Button>
          </div>
        </div>
      </section>

      <SummaryStrip items={accountHealthSummary} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget) => (
          <article key={widget.title} className="premium-card premium-surface p-5 hover:border-brand/25 hover:shadow-card">
            <p className="text-sm font-bold text-slate">{widget.title}</p>
            <p className="mt-3 text-3xl font-black text-ink">{widget.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{widget.description}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <article key={action.title} className="surface-card p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
              <Icon name={action.icon} className="h-4.5 w-4.5" />
            </span>
            <h2 className="mt-5 text-lg font-black text-ink">{action.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate">{action.detail}</p>
            <Button href={action.href} variant="secondary" className="mt-5 w-full px-4 py-2.5 text-xs">
              Open
            </Button>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-ink">Recent orders</h2>
            <Button href="/account/orders" variant="secondary" className="px-4 py-2 text-xs">Review Orders</Button>
          </div>
          <div className="mt-5 space-y-4">
            {demoOrders.slice(0, 2).map((order) => (
              <article key={order.id} className="rounded-[1.35rem] border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
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

        <section className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-ink">Recent quotes</h2>
            <Button href="/account/quotes" variant="secondary" className="px-4 py-2 text-xs">Review Quotes</Button>
          </div>
          <div className="mt-5 space-y-4">
            {demoQuotes.map((quote) => (
              <article key={quote.id} className="rounded-[1.35rem] border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
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

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <StatusTimeline
          title="Most urgent account progress"
          items={featuredTimeline}
        />
        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-line/80 bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Current focus</p>
                <h2 className="mt-2 text-xl font-black text-ink">Most time-sensitive job in your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate">{featuredOrder.nextStep}</p>
              </div>
              <StatusBadge status={featuredOrder.status} />
            </div>
          </div>
          <AccountSupportHub
            title="Everything needed to keep the job moving"
            description="This account view is structured around the real jobs customers come back to: reorders, file reuse, proofs, invoices, and quick support."
            shortcuts={accountSupportShortcuts.map((item, index) => ({
              ...item,
              icon: index === 0 ? "clock" : index === 1 ? "upload" : "bag",
            }))}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AccountActivityFeed items={demoActivity} />
        <AddressBookPanel addresses={demoAddresses} />
      </div>

      <ReorderStudio items={demoReorders} />

      <section className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-ink p-6 text-white shadow-card">
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
