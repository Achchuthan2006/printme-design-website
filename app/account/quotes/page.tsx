import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { AccountSupportHub } from "@/components/account/account-support-hub";
import { QuotesHistoryPanel } from "@/components/account/quotes-history-panel";
import { Button } from "@/components/ui/button";
import { demoQuotes } from "@/data/account";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/metadata";
import { SummaryStrip } from "@/components/platform/summary-strip";

export const metadata = buildMetadata({ title: "Account Quotes", description: "Review PrintMe quote requests and future approval steps.", path: "/account/quotes" });

export default function AccountQuotesPage() {
  const previewMode = !isSupabaseConfigured();
  const quotes = previewMode ? demoQuotes : [];
  const quoteSummary = [
    { label: "Open quotes", value: String(quotes.filter((quote) => !["approved", "expired"].includes(quote.status)).length), detail: "Requests still moving through review, pricing, or approval." },
    { label: "Proof-linked quotes", value: String(quotes.filter((quote) => quote.proofPortalId).length), detail: "Quotes already tied to a formal proof review or revision cycle." },
    { label: "Ready to approve", value: String(quotes.filter((quote) => quote.status === "priced").length), detail: "Quotes closest to becoming real orders." },
    { label: "Custom work", value: String(quotes.filter((quote) => quote.service === "Custom Orders").length), detail: "Jobs that may need more staff guidance before production." },
    { label: "File-led quotes", value: String(quotes.length), detail: "Quote requests structured to connect to uploads, notes, and future orders." },
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
            {quotes.length === 0 ? (
              <div className="mt-6"><EmptyState title={previewMode ? "No quotes yet" : "No live quotes yet"} description={previewMode ? "Send a quote request when you want PrintMe to review specs, artwork, timing, and pricing before you commit." : "Live quote requests will appear here after submission so you can track review, pricing, and next steps."} ctaLabel="Request a Quote" ctaHref="/quote-request" /></div>
            ) : (
              <QuotesHistoryPanel quotes={quotes} />
            )}
            <div className="mt-6">
              <AccountSupportHub
                title="Quote help inside your account"
                description="Use this area when a quote needs file updates, quantity changes, approval help, or a smoother handoff into production."
                shortcuts={[
                  { title: "Ask about quote timing", detail: "Best when you need pricing or turnaround clarified before you approve.", href: "/support", cta: "Message PrintMe", icon: "chat" },
                  { title: "Review attached files", detail: "Open the file area if the quote needs a replacement upload or artwork fix.", href: "/account/files", cta: "Open Files", icon: "upload" },
                  { title: "Restart as a repeat quote", detail: "Use the reorder area when this quote should become a new variation instead.", href: "/account/reorders", cta: "Open Reorders", icon: "document" },
                ]}
              />
            </div>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
