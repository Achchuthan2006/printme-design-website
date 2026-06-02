"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/components/account/auth-provider";
import { StatusBadge } from "@/components/account/status-badge";
import { accountHealthSummary, accountOrderProgress, accountSupportShortcuts, demoActivity, demoAddresses, demoFiles, demoInvoices, demoOrders, demoProfile, demoProofPortals, demoQuotes, demoReorders, demoSavedDesigns } from "@/data/account";
import { SummaryStrip } from "@/components/platform/summary-strip";
import { StatusTimeline } from "@/components/platform/status-timeline";
import { AccountActivityFeed } from "@/components/account/account-activity-feed";
import { AddressBookPanel } from "@/components/account/address-book-panel";
import { AccountMemoryPanel } from "@/components/account/account-memory-panel";
import { ReorderStudio } from "@/components/account/reorder-studio";
import { ReturningCustomerIntelligence } from "@/components/ai/returning-customer-intelligence";
import { AccountSupportHub } from "@/components/account/account-support-hub";
import { products } from "@/data/products";
import { AccountDashboardData } from "@/types";

export function AccountShell() {
  const { user, configured, accessToken, profile } = useAuth();
  const [dashboard, setDashboard] = useState<AccountDashboardData | null>(null);
  const liveDashboard = configured && user && accessToken ? dashboard : null;

  useEffect(() => {
    if (!configured || !user || !accessToken) return;

    let cancelled = false;

    fetch("/api/account/dashboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load dashboard.");
        }
        return (await response.json()) as AccountDashboardData;
      })
      .then((data) => {
        if (!cancelled) {
          setDashboard(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDashboard(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, configured, user]);

  const previewMode = !configured;
  const liveProfile = liveDashboard?.profile ?? profile ?? (previewMode ? demoProfile : {
    fullName: user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "PrintMe customer",
    email: user?.email ?? "",
    phone: typeof user?.user_metadata?.phone === "string" ? user.user_metadata.phone : undefined,
    companyName: typeof user?.user_metadata?.company_name === "string" ? user.user_metadata.company_name : undefined,
  });
  const liveOrders = liveDashboard?.orders ?? (previewMode ? demoOrders : []);
  const liveQuotes = liveDashboard?.quotes ?? (previewMode ? demoQuotes : []);
  const liveFiles = liveDashboard?.files ?? (previewMode ? demoFiles : []);
  const liveInvoices = liveDashboard?.invoices ?? (previewMode ? demoInvoices : []);
  const liveAddresses = liveDashboard?.addresses ?? (previewMode ? demoAddresses : []);
  const liveActivity = liveDashboard?.activity ?? (previewMode ? demoActivity : []);
  const liveReorders = liveDashboard?.reorders ?? (previewMode ? demoReorders : []);
  const liveSavedDesigns = liveDashboard?.savedDesigns ?? (previewMode ? demoSavedDesigns : []);
  const liveSummary = liveDashboard?.summary?.length ? liveDashboard.summary : previewMode ? accountHealthSummary : [
    { label: "Orders", value: String(liveOrders.length), detail: "Real orders tied to this account." },
    { label: "Quotes", value: String(liveQuotes.length), detail: "Live quote requests tied to this account." },
    { label: "Files", value: String(liveFiles.length), detail: "Uploaded artwork attached to this account." },
    { label: "Invoices", value: String(liveInvoices.length), detail: "Billing records currently available in the account." },
  ];
  const liveProofs = previewMode ? demoProofPortals : [];
  const displayName = liveProfile.fullName ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "PrintMe customer";
  const widgets = [
    { title: "Open Orders", value: String(liveOrders.filter((order) => order.status !== "completed").length), description: "Track active jobs and know what needs review next." },
    { title: "Proofs Waiting", value: String(liveProofs.filter((proof) => proof.status !== "approved_for_production").length), description: "Approve proofs or request changes before production starts." },
    { title: "Saved Quotes", value: String(liveQuotes.length), description: "Keep quote requests organized for faster approvals." },
    { title: "Uploaded Files", value: String(liveFiles.length), description: "Keep artwork ready for quotes, orders, and reorders." },
    { title: "Invoices", value: String(liveInvoices.length), description: "Access billing records as the order system grows." },
  ];
  const quickActions = [
    { title: "Start a reorder-friendly quote", detail: "Use the quote flow when you want a familiar job priced again with updated timing or quantity.", href: "/quote-request", icon: "document" },
    { title: "Review proofs and approvals", detail: "Open your proof portal to compare versions, request changes, or approve final artwork.", href: "/account/proofs", icon: "inspect" },
    { title: "Upload or organize artwork", detail: "Keep files attached to the right order, quote, or future repeat job.", href: "/account/files", icon: "upload" },
    { title: "Reuse a saved design starter", detail: "Jump back into a template-led or uploaded design path without starting from zero.", href: "/products", icon: "spark" },
    { title: "Talk to support", detail: "Ask about pickup timing, status, invoices, or the next production step.", href: "/support", icon: "chat" },
  ];
  const featuredOrder = liveOrders[0] ?? (previewMode ? demoOrders[0] : null);
  const featuredTimeline = featuredOrder ? accountOrderProgress[featuredOrder.id] ?? [] : [];

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
              {liveProfile.companyName ? <span className="value-chip">{liveProfile.companyName}</span> : null}
              <span className="value-chip">{liveProfile.email}</span>
              {liveProfile.phone ? <span className="value-chip">{liveProfile.phone}</span> : null}
            </div>
            <div className="mt-4 rounded-[1.3rem] border border-line/80 bg-canvas px-4 py-3 text-xs leading-5 text-slate">
              <span className="font-black text-ink">Current dashboard state:</span>{" "}
              {configured
                ? liveDashboard
                  ? "this account is now reading persisted customer profile, order, quote, file, and invoice data when available from the backend."
                  : "account access is live. Empty sections stay empty until real orders, quotes, files, invoices, and reorders exist for this customer."
                : "this is a preview dashboard until Supabase auth and persisted customer data are fully configured."}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products">Start My Order</Button>
            <Button href="/quote-request" variant="secondary">Request a Quote</Button>
          </div>
        </div>
      </section>

      <SummaryStrip items={liveSummary} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {widgets.map((widget) => (
          <article key={widget.title} className="premium-card premium-surface p-5 hover:border-brand/25 hover:shadow-card">
            <p className="text-sm font-bold text-slate">{widget.title}</p>
            <p className="mt-3 text-3xl font-black text-ink">{widget.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{widget.description}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
            {liveOrders.slice(0, 2).map((order) => (
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
            {liveOrders.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-line/90 p-5 text-sm leading-6 text-slate">
                No live orders are attached to this account yet. Start a new order or request a quote and the history will appear here.
              </div>
            ) : null}
          </div>
        </section>

        <section className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-ink">Recent quotes</h2>
            <Button href="/account/quotes" variant="secondary" className="px-4 py-2 text-xs">Review Quotes</Button>
          </div>
          <div className="mt-5 space-y-4">
            {liveQuotes.map((quote) => (
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
            {liveQuotes.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-line/90 p-5 text-sm leading-6 text-slate">
                No live quotes are attached to this account yet. Quote requests will appear here after submission.
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <StatusTimeline
          title="Most urgent account progress"
          items={featuredOrder ? featuredTimeline : [{ label: "No active workflow yet", detail: "As soon as you place an order or submit a quote, live timeline events will start appearing here.", status: "current" }]}
        />
        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-line/80 bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Current focus</p>
                <h2 className="mt-2 text-xl font-black text-ink">Most time-sensitive job in your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate">{featuredOrder?.nextStep ?? "Once the first live order or quote lands here, this area will highlight the next action that matters most."}</p>
              </div>
              {featuredOrder ? <StatusBadge status={featuredOrder.status} /> : null}
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
      <AccountActivityFeed items={liveActivity} />
      <AddressBookPanel addresses={liveAddresses} />
      </div>

      <AccountMemoryPanel products={products} />

      <ReturningCustomerIntelligence
        orders={liveOrders}
        quotes={liveQuotes}
        reorders={liveReorders}
        savedDesigns={liveSavedDesigns}
      />

      <ReorderStudio items={liveReorders} />

      <section className="surface-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="editorial-kicker">Saved design readiness</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Template and artwork starters tied to your account</h2>
          </div>
          <Button href="/products" variant="secondary" className="px-4 py-2 text-xs">Browse Products</Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {liveSavedDesigns.map((design) => (
            <article key={design.id} className="rounded-[1.35rem] border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
              <p className="text-sm font-black text-ink">{design.title}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate">{design.productTitle}</p>
              <p className="mt-3 text-sm leading-6 text-slate">{design.detail}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="value-chip">{design.source.replace("-", " ")}</span>
                <span className="text-xs font-bold text-slate">{design.updatedAt}</span>
              </div>
              <div className="mt-4">
                <Button href={design.href} variant="secondary" className="w-full px-4 py-2 text-[11px]">
                  Continue
                </Button>
              </div>
            </article>
          ))}
          {liveSavedDesigns.length === 0 ? (
            <div className="rounded-[1.35rem] border border-dashed border-line/90 p-5 text-sm leading-6 text-slate md:col-span-3">
              Saved design starters will appear here after template-led jobs, uploaded artwork, or design-supported orders are tied to this account.
            </div>
          ) : null}
        </div>
      </section>

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
