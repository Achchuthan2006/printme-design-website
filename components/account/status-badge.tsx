import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending_review: "bg-amber-50 text-amber-700",
  quote_required: "bg-brand-soft text-brand",
  in_production: "bg-blue-50 text-blue-700",
  ready_for_pickup: "bg-emerald-50 text-emerald-700",
  completed: "bg-neutral-100 text-neutral-700",
  new: "bg-brand-soft text-brand",
  reviewing: "bg-amber-50 text-amber-700",
  priced: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  expired: "bg-neutral-100 text-neutral-700",
  received: "bg-blue-50 text-blue-700",
  uploaded: "bg-blue-50 text-blue-700",
  awaiting_review: "bg-amber-50 text-amber-700",
  needs_review: "bg-amber-50 text-amber-700",
  needs_changes: "bg-red-50 text-red-700",
  approved_for_print: "bg-emerald-50 text-emerald-700",
  proof_required: "bg-brand-soft text-brand",
  ready_for_production: "bg-emerald-50 text-emerald-700",
  paid: "bg-emerald-50 text-emerald-700",
  unpaid: "bg-amber-50 text-amber-700",
  void: "bg-neutral-100 text-neutral-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em]", statusStyles[status] ?? "bg-neutral-100 text-neutral-700")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
