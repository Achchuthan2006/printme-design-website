import { notFound } from "next/navigation";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { accountQuoteProgress, demoFiles, demoQuotes } from "@/data/account";
import { StatusTimeline } from "@/components/platform/status-timeline";

export default async function AccountQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = demoQuotes.find((item) => item.id === id);
  if (!quote) notFound();
  const linkedFiles = demoFiles.filter((file) => quote.linkedFiles?.includes(file.id));

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="space-y-6">
            <div className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Quote details</p>
                  <h1 className="mt-2 text-3xl font-black text-ink">{quote.service}</h1>
                  <p className="mt-2 text-sm text-slate">{quote.requestedDate}</p>
                  {quote.estimatedValue ? <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-brand">Estimated value {quote.estimatedValue}</p> : null}
                </div>
                <StatusBadge status={quote.status} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
                  <h2 className="text-2xl font-black text-ink">Quote summary</h2>
                  <p className="mt-4 text-sm leading-7 text-slate">{quote.summary}</p>
                  {quote.nextStep ? (
                    <div className="mt-5 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                      <p className="font-black text-ink">Best next step</p>
                      <p className="mt-1">{quote.nextStep}</p>
                    </div>
                  ) : null}
                </section>

                {linkedFiles.length > 0 ? (
                  <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
                    <h2 className="text-2xl font-black text-ink">Attached files</h2>
                    <div className="mt-5 grid gap-3">
                      {linkedFiles.map((file) => (
                        <article key={file.id} className="rounded-[1.2rem] border border-line bg-canvas p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-black text-ink">{file.fileName}</p>
                              <p className="mt-1 text-xs font-bold text-slate">{file.fileType} / {file.fileSize}</p>
                              {file.reviewNote ? <p className="mt-2 text-sm leading-6 text-slate">{file.reviewNote}</p> : null}
                            </div>
                            <StatusBadge status={file.status} />
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                <StatusTimeline
                  title="Quote progress"
                  items={accountQuoteProgress[quote.id] ?? [
                    { label: "Quote received", detail: "Live quote activity will appear here as workflow events are connected.", status: "current" },
                  ]}
                />
              </div>

              <aside className="h-fit rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-black text-ink">Actions</h2>
                <div className="mt-5 grid gap-3">
                  <Button href={`/quote-request?service=${encodeURIComponent(quote.service)}`}>Update Quote</Button>
                  <Button href="/account/files" variant="secondary">Review Linked Files</Button>
                  <Button href="/support" variant="secondary">Ask About This Quote</Button>
                </div>
                <div className="mt-5 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                  <p className="font-black text-ink">Quote-to-order readiness</p>
                  <p className="mt-1">
                    Approved and priced quotes are structured to become production-ready orders once the final files, quantities, and fulfillment details are confirmed.
                  </p>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate">
                  Quote detail pages are ready to connect to admin notes, approvals, file replacements, and future quote-to-order conversion logic.
                </p>
              </aside>
            </div>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
