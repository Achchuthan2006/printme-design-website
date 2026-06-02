import { ArtworkUploadMetadata, ProductOrderMethod } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";

export function AdminFileWorkflowPanel({
  uploads,
  orderMethod,
  templateTitle,
  designRequired,
}: {
  uploads: Array<ArtworkUploadMetadata | { id: string; fileName?: string; status?: string }>;
  orderMethod: ProductOrderMethod | "quote-first";
  templateTitle?: string;
  designRequired?: boolean;
}) {
  return (
    <AdminCard>
      <h2 className="text-2xl font-black text-ink">Files and workflow</h2>
      <p className="mt-2 text-sm leading-6 text-slate">Order method: {orderMethod.replaceAll("-", " ")}</p>
      {templateTitle ? <p className="mt-2 text-sm leading-6 text-slate">Template: {templateTitle}</p> : null}
      {designRequired ? <p className="mt-2 text-sm leading-6 text-slate">Design support is still part of the workflow.</p> : null}
      <div className="mt-4 space-y-2">
        {uploads.map((upload) => (
          <div key={upload.id} className="rounded-xl border border-line bg-canvas p-3 text-sm text-slate">
            {upload.fileName ?? upload.id}
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
