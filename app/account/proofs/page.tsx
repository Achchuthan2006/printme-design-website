import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { demoProofPortals } from "@/data/account";

export default function AccountProofsPage() {
  return (
    <>
      <PageHero
        title="Review proofs and approvals"
        description="Use the proof portal links below to compare versions, request revisions, or approve artwork."
        eyebrow="Proofs"
      />
      <section className="section-space">
        <div className="container-shell grid gap-4">
          {demoProofPortals.map((proof) => (
            <Link key={proof.id} href={`/account/proofs/${proof.id}`} className="surface-card p-6 transition hover:border-brand/20">
              <p className="text-sm font-black text-ink">{proof.orderNumber} / {proof.jobName}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{proof.nextStepMessage}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
