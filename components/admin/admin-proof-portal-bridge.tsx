import Link from "next/link";
import { ProofPortalRecord } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";

export function AdminProofPortalBridge({ proof }: { proof?: ProofPortalRecord | null }) {
  if (!proof) return null;

  return (
    <AdminCard>
      <h2 className="text-2xl font-black text-ink">Customer proof portal</h2>
      <p className="mt-3 text-sm leading-6 text-slate">{proof.nextStepMessage}</p>
      <Link href={`/account/proofs/${proof.id}`} className="mt-4 inline-flex text-sm font-black text-brand">
        Open linked proof
      </Link>
    </AdminCard>
  );
}
