import { ProtectedAccount } from "@/components/account/protected-account";
import { ReorderStudio } from "@/components/account/reorder-studio";
import { SummaryStrip } from "@/components/platform/summary-strip";
import { Button } from "@/components/ui/button";
import { demoReorders } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Account Reorders",
  description: "Restart repeat PrintMe jobs faster with saved artwork, previous specs, and quote-friendly order history.",
  path: "/account/reorders",
});

export default function AccountReordersPage() {
  const reorderSummary = [
    { label: "Repeat-ready jobs", value: String(demoReorders.length), detail: "Previous orders and quotes prepared to restart faster." },
    { label: "Best via cart", value: String(demoReorders.filter((item) => item.recommendedPath === "cart").length), detail: "Jobs with cleaner direct-order potential when the setup stays close." },
    { label: "Best via quote", value: String(demoReorders.filter((item) => item.recommendedPath === "quote").length), detail: "Jobs that still benefit from a team review before production." },
    { label: "Saved file leverage", value: String(demoReorders.length), detail: "Repeat requests that can reuse artwork, notes, or prior production context." },
  ];

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="space-y-6">
            <section className="hero-panel p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="editorial-kicker">Reorders</p>
                  <h1 className="display-title mt-2 text-[2.5rem] font-black">Restart proven jobs without starting from scratch.</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate">
                    Use previous orders and quotes as the starting point when the artwork is similar, the service is familiar, or the only thing changing is the quantity, timing, or finish.
                  </p>
                </div>
                <Button href="/quote-request">Start New Quote</Button>
              </div>
            </section>
            <SummaryStrip items={reorderSummary} />
            <ReorderStudio items={demoReorders} title="Saved repeat-job shortcuts" />
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
