import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminUploadsReviewView } from "@/components/admin/admin-uploads-review-view";
import { adminUploads } from "@/data/admin";

export default function AdminUploadsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artwork review"
        description="See uploaded artwork, connect files to orders or quotes, and track whether files are print-ready, need changes, or require proof approval."
        actionLabel="Artwork Guidelines"
        actionHref="/artwork-guidelines"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Upload queue</p><p className="mt-2 text-4xl font-black text-ink">{adminUploads.length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Awaiting review</p><p className="mt-2 text-4xl font-black text-ink">{adminUploads.filter((upload) => upload.status === "awaiting_review").length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Proof required</p><p className="mt-2 text-4xl font-black text-ink">{adminUploads.filter((upload) => upload.status === "proof_required").length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Ready for production</p><p className="mt-2 text-4xl font-black text-ink">{adminUploads.filter((upload) => upload.status === "ready_for_production" || upload.status === "approved_for_print").length}</p></AdminCard>
      </div>
      <AdminUploadsReviewView uploads={adminUploads} />
    </div>
  );
}
