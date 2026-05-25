import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { demoFiles } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";
import { SummaryStrip } from "@/components/platform/summary-strip";

export const metadata = buildMetadata({
  title: "Account Files",
  description: "Manage PrintMe artwork files for quotes, orders, proofs, and future reorders.",
  path: "/account/files",
});

export default function AccountFilesPage() {
  const fileSummary = [
    { label: "Saved files", value: String(demoFiles.length), detail: "Artwork kept ready for quotes, orders, and repeat jobs." },
    { label: "Awaiting review", value: String(demoFiles.filter((file) => file.status === "awaiting_review").length), detail: "Files that still need PrintMe review before they can move forward." },
    { label: "Approved for print", value: String(demoFiles.filter((file) => file.status === "approved_for_print").length), detail: "Artwork already cleared for future reuse." },
    { label: "Reuse-ready", value: String(demoFiles.length), detail: "Files that can speed up repeat orders and support conversations." },
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
            {demoFiles.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No files uploaded"
                  description="Upload artwork with a quote request so PrintMe can review the file before production."
                  ctaLabel="Get My Quote"
                  ctaHref="/quote-request"
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {demoFiles.map((file) => (
                  <article
                    key={file.id}
                    className="rounded-2xl border border-line/90 p-5 transition hover:border-brand/25 hover:bg-brand-soft/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-black text-ink">{file.fileName}</h2>
                        <p className="mt-2 text-sm text-slate">Related to {file.relatedTo}</p>
                        <p className="mt-1 text-xs font-bold text-slate">
                          {file.uploadedAt} / {file.fileType} / {file.fileSize}
                        </p>
                      </div>
                      <StatusBadge status={file.status} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button href={`/account/files?file=${file.id}`} variant="secondary" className="px-4 py-2 text-xs">
                        Review File
                      </Button>
                      <Button href="/quote-request" variant="secondary" className="px-4 py-2 text-xs">
                        Use in Quote
                      </Button>
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
