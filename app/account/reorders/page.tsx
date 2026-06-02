import { ProtectedAccount } from "@/components/account/protected-account";
import { AccountSupportHub } from "@/components/account/account-support-hub";
import { ReorderStudio } from "@/components/account/reorder-studio";
import { SummaryStrip } from "@/components/platform/summary-strip";
import { Button } from "@/components/ui/button";
import { demoReorders } from "@/data/account";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Account Reorders",
  description: "Restart repeat PrintMe jobs faster with saved artwork, previous specs, and quote-friendly order history.",
  path: "/account/reorders",
});

export default function AccountReordersPage() {
  const previewMode = !isSupabaseConfigured();
  const reorders = previewMode ? demoReorders : [];
  const reorderSummary = [
    { label: "Repeat-ready jobs", value: String(reorders.length), detail: "Previous orders and quotes prepared to restart faster." },
    { label: "Best via cart", value: String(reorders.filter((item) => item.recommendedPath === "cart").length), detail: "Jobs with cleaner direct-order potential when the setup stays close." },
    { label: "Best via quote", value: String(reorders.filter((item) => item.recommendedPath === "quote").length), detail: "Jobs that still benefit from a team review before production." },
    { label: "Saved file leverage", value: String(reorders.length), detail: "Repeat requests that can reuse artwork, notes, or prior production context." },
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
            <ReorderStudio items={reorders} title="Saved repeat-job shortcuts" />
            <AccountSupportHub
              title="Repeat business help"
              description="Use support when a repeat job needs updated specs, a new file, delivery changes, or a cleaner quote-to-order handoff."
              shortcuts={[
                { title: "Restart with updated specs", detail: "Best when quantity, finish, or delivery changed from the original job.", href: "/quote-request", cta: "Start New Quote", icon: "document" },
                { title: "Reuse saved artwork", detail: "Check the file library when the print setup is familiar but the artwork needs confirming.", href: "/account/files", cta: "Review Files", icon: "upload" },
                { title: "Talk to PrintMe first", detail: "Use support if you want the team to recommend the fastest repeat-order path.", href: "/support", cta: "Open Support", icon: "chat" },
              ]}
            />
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
