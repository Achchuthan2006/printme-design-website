import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { AccountSupportHub } from "@/components/account/account-support-hub";
import { demoFiles } from "@/data/account";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/metadata";
import { SummaryStrip } from "@/components/platform/summary-strip";

export const metadata = buildMetadata({
  title: "Account Files",
  description: "Manage PrintMe artwork files for quotes, orders, proofs, and future reorders.",
  path: "/account/files",
});

export default function AccountFilesPage() {
  const previewMode = !isSupabaseConfigured();
  const files = previewMode ? demoFiles : [];
  const fileSummary = [
    { label: "Saved files", value: String(files.length), detail: "Artwork kept ready for quotes, orders, and repeat jobs." },
    { label: "Awaiting review", value: String(files.filter((file) => file.status === "awaiting_review").length), detail: "Files that still need PrintMe review before they can move forward." },
    { label: "Approved for print", value: String(files.filter((file) => file.status === "approved_for_print").length), detail: "Artwork already cleared for future reuse." },
    { label: "Reuse-ready", value: String(files.length), detail: "Files that can speed up repeat orders and support conversations." },
  ];

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Files</p>
                <h1 className="mt-2 text-3xl font-black text-ink">Uploaded artwork</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
                  Keep artwork ready for quotes, orders, proofs, approvals, and future reorders.
                </p>
              </div>
              <Button href="/quote-request">Upload With Quote</Button>
            </div>
            <SummaryStrip items={fileSummary} className="mt-6" />
            <div className="mt-6">
              <ArtworkUploadZone
                context={{ scope: "account", relatedLabel: "Account file library" }}
                title="Keep artwork ready for the next job"
                description="Store files for an upcoming quote or reorder so PrintMe can reference them quickly when you need production help."
                helperText="Clear filenames help us match artwork to the right quote, order, or reorder."
                className="shadow-none"
              />
            </div>
            {files.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title={previewMode ? "No files uploaded" : "No live files uploaded yet"}
                  description={previewMode ? "Upload artwork with a quote request so PrintMe can review the file before production." : "Uploaded artwork will appear here once files are attached to a real quote, order, or account upload."}
                  ctaLabel="Get My Quote"
                  ctaHref="/quote-request"
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {files.map((file) => (
                  <article
                    key={file.id}
                    className="rounded-2xl border border-line/90 p-5 transition hover:border-brand/25 hover:bg-brand-soft/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-black text-ink">{file.fileName}</h2>
                        <p className="mt-2 text-sm text-slate">
                          Related to {file.relatedTo}
                          {file.relatedType ? ` / ${file.relatedType}` : ""}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate">
                          {file.uploadedAt} / {file.fileType} / {file.fileSize}
                        </p>
                      </div>
                      <StatusBadge status={file.status} />
                    </div>
                    {file.reviewNote ? (
                      <div className="mt-4 rounded-[1rem] border border-line/80 bg-canvas px-4 py-3 text-sm leading-6 text-slate">
                        <p className="font-black text-ink">Review note</p>
                        <p className="mt-1">{file.reviewNote}</p>
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {file.reusable ? (
                        <span className="value-chip">Ready for reuse</span>
                      ) : (
                        <span className="value-chip">Needs updates before reuse</span>
                      )}
                      <span className="value-chip">{file.relatedType === "quote" ? "Quote-linked" : file.relatedType === "order" ? "Order-linked" : "File library"}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button href={`/account/files?file=${file.id}`} variant="secondary" className="px-4 py-2 text-xs">
                        Review File
                      </Button>
                      <Button href="/quote-request" variant="secondary" className="px-4 py-2 text-xs">
                        Use in Quote
                      </Button>
                      <Button href="/support" variant="secondary" className="px-4 py-2 text-xs">
                        Replace or Fix File
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className="mt-6">
              <AccountSupportHub
                title="Artwork and upload help"
                description="Use account support when a file needs replacing, a proof is unclear, or you want to reuse artwork for a repeat quote or order."
                shortcuts={[
                  { title: "Replace a problem file", detail: "Best when a file needs bleed, colour, or size fixes before production.", href: "/support", cta: "Get File Help", icon: "upload" },
                  { title: "Reuse saved artwork", detail: "Quote or reorder faster by referencing artwork already attached to your account.", href: "/account/reorders", cta: "Open Reorders", icon: "bag" },
                  { title: "Start a quote with files", detail: "Use the quote path when the file is ready but the specs still need review.", href: "/quote-request", cta: "Request Quote", icon: "document" },
                ]}
              />
            </div>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
