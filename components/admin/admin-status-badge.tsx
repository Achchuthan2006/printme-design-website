import { cn } from "@/lib/utils";

const toneByStatus: Record<string, string> = {
  urgent: "border-red-200 bg-red-50 text-red-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  normal: "border-slate-200 bg-white text-slate",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved_for_print: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ready_for_production: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ready_for_pickup: "border-blue-200 bg-blue-50 text-blue-700",
  in_production: "border-blue-200 bg-blue-50 text-blue-700",
  awaiting_review: "border-amber-200 bg-amber-50 text-amber-700",
  proof_required: "border-amber-200 bg-amber-50 text-amber-700",
  waiting_for_files: "border-amber-200 bg-amber-50 text-amber-700",
  awaiting_payment: "border-amber-200 bg-amber-50 text-amber-700",
  needs_changes: "border-red-200 bg-red-50 text-red-700",
  on_hold: "border-slate-300 bg-slate-100 text-slate-700",
  open: "border-orange-200 bg-orange-50 text-orange-700",
  waiting: "border-amber-200 bg-amber-50 text-amber-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function AdminStatusBadge({ status, label }: { status: string; label?: string }) {
  const text = label ?? status.replaceAll("_", " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em]",
        toneByStatus[status] ?? "border-line bg-white text-slate",
      )}
    >
      {text}
    </span>
  );
}
