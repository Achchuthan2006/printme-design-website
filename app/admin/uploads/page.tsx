import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminUploads, uploadStatusLabels } from "@/data/admin";

export default function AdminUploadsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artwork review"
        description="See uploaded artwork, connect files to orders or quotes, and track whether files are print-ready, need changes, or require proof approval."
        actionLabel="Artwork Guidelines"
        actionHref="/artwork-guidelines"
      />
      <AdminFilterBar>
        {["All", "Awaiting Review", "Needs Changes", "Proof Required", "Approved"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["File", "Customer", "Related to", "Status", "Priority", "Notes", "Action"]}
        rows={adminUploads.map((upload) => [
          <div key="file">
            <p>{upload.fileName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{upload.fileType} / {upload.fileSize} / {upload.uploadedAt}</p>
          </div>,
          <span key="customer">{upload.customerName}</span>,
          <span key="related">{upload.relatedTo}</span>,
          <AdminStatusBadge key="status" status={upload.status} label={uploadStatusLabels[upload.status]} />,
          <AdminStatusBadge key="priority" status={upload.priority} />,
          <span key="notes" className="max-w-xs text-slate">{upload.notes}</span>,
          <button key="action" className="font-black text-brand hover:text-brand-dark">Review</button>,
        ])}
      />
    </div>
  );
}
