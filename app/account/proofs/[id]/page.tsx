import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { getProofPortalById } from "@/data/account";

export default async function AccountProofDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proof = getProofPortalById(id);
  if (!proof) notFound();

  return (
    <>
      <PageHero
        title={proof.jobName}
        description={proof.nextStepMessage}
        eyebrow="Proof review"
      />
      <section className="section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <section className="surface-card p-6">
            <h2 className="text-2xl font-black text-ink">Checklist</h2>
            <div className="mt-4 space-y-3">
              {proof.reviewChecklist.map((item) => (
                <div key={item.id} className="rounded-xl border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="surface-card p-6">
            <h2 className="text-2xl font-black text-ink">Versions</h2>
            <div className="mt-4 space-y-3">
              {proof.versions.map((version) => (
                <div key={version.id} className="rounded-xl border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">{version.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{version.changeSummary.join(" ")}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
