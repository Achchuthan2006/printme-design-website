import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { accountQuoteProgress, demoQuotes } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";
import { SummaryStrip } from "@/components/platform/summary-strip";

export const metadata = buildMetadata({ title: "Account Quotes", description: "Review PrintMe quote requests and future approval steps.", path: "/account/quotes" });

export default function AccountQuotesPage() {
  const quoteSummary = [
    { label: "Open quotes", value: String(demoQuotes.filter((quote) => !["approved", "expired"].includes(quote.status)).length), detail: "Requests still moving through review, pricing, or approval." },
    { label: "Ready to approve", value: String(demoQuotes.filter((quote) => quote.status === "priced").length), detail: "Quotes closest to becoming real orders." },
    { label: "Custom work", value: String(demoQuotes.filter((quote) => quote.service === "Custom Orders").length), detail: "Jobs that may need more staff guidance before production." },
    { label: "File-led quotes", value: String(demoQuotes.length), detail: "Quote requests structured to connect to uploads, notes, and future orders." },
  ];

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Quotes</p>
                <h1 className="mt-2 text-3xl font-black text-ink">Quote requests</h1>
              </div>
              <Button href="/quote-request">Request New Quote</Button>
            </div>
            <SummaryStrip items={quoteSummary} className="mt-6" />
            {demoQuotes.length === 0 ? (
              <div className="mt-6"><EmptyState title="No quotes yet" description="Send a quote request when you want PrintMe to review specs, artwork, timing, and pricing before you commit." ctaLabel="Request a Quote" ctaHref="/quote-request" /></div>
            ) : (
              <div className="mt-6 grid gap-4">
                {demoQuotes.map((quote) => (
                  <article key={quote.id} className="rounded-lg border border-line p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-black text-ink">{quote.service}</h2>
                        <p className="mt-2 text-sm text-slate">{quote.summary}</p>
                        <p className="mt-2 text-xs font-bold text-slate">{quote.requestedDate}</p>
                      </div>
                      <StatusBadge status={quote.status} />
                    </div>
                    <div className="mt-4 rounded-[1.2rem] border border-line bg-canvas p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate">Current quote flow</p>
                      <p className="mt-2 text-sm leading-6 text-slate">
                        {(accountQuoteProgress[quote.id] ?? []).find((item) => item.status === "current")?.detail ?? "Quote activity will appear here as the platform connects to live workflow events."}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button href="/support" variant="secondary" className="px-4 py-2 text-xs">Message PrintMe</Button>
                      <Button href={`/quote-request?service=${encodeURIComponent(quote.service)}`} variant="secondary" className="px-4 py-2 text-xs">Update Quote Details</Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
