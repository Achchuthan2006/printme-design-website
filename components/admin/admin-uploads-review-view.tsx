"use client";

import { useMemo, useState } from "react";
import { AdminUpload } from "@/types";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Input, Select } from "@/components/ui/form-controls";
import { AdminTable } from "@/components/admin/admin-table";
import { uploadStatusLabels } from "@/data/admin";

export function AdminUploadsReviewView({ uploads }: { uploads: AdminUpload[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const visibleUploads = useMemo(() => {
    return uploads.filter((upload) => {
      const matchesQuery =
        query.trim().length === 0 ||
        upload.fileName.toLowerCase().includes(query.toLowerCase()) ||
        upload.customerName.toLowerCase().includes(query.toLowerCase()) ||
        upload.relatedTo.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || upload.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [uploads, query, status]);

  return (
    <div className="space-y-4">
      <div className="hero-panel grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-[1fr_220px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file, customer, or order/quote" />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All upload states</option>
          <option value="awaiting_review">Awaiting review</option>
          <option value="proof_required">Proof required</option>
          <option value="needs_changes">Needs changes</option>
          <option value="approved_for_print">Approved for print</option>
        </Select>
      </div>
      <AdminTable
        columns={["File", "Customer", "Related to", "Status", "Priority", "Notes", "Action"]}
        rows={visibleUploads.map((upload) => [
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
        emptyLabel="No uploads match the current search or status filter."
      />
    </div>
  );
}
