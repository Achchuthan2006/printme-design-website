import { AdminProductionQueueJob } from "@/types";

export function AdminProductionQueue({ jobs }: { jobs: AdminProductionQueueJob[] }) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl border border-line bg-canvas p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-ink">{job.reference} / {job.product}</p>
              <p className="mt-1 text-sm leading-6 text-slate">{job.note}</p>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate">{job.stage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
