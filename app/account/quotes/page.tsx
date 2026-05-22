import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { demoQuotes } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Account Quotes", description: "Review PrintMe quote requests and future approval steps.", path: "/account/quotes" });

export default function AccountQuotesPage() {
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
              <Button href="/quote-request">Get New Quote</Button>
            </div>
            {demoQuotes.length === 0 ? (
              <div className="mt-6"><EmptyState title="No quotes yet" description="Send a quote request when you want PrintMe to review specs, artwork, timing, and pricing before you commit." ctaLabel="Get My Quote" ctaHref="/quote-request" /></div>
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
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="text-sm font-bold text-brand">Approve Next Step</button>
                      <button className="text-sm font-bold text-slate">Message PrintMe</button>
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
