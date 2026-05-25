import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { faqs } from "@/lib/site";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Answers about printing services, rush turnaround, custom orders, design support, pickup, delivery, and online quote requests at PrintMe Design.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently asked questions"
        description="A simple FAQ for customers who need help with services, timing, design support, pickup, delivery, and how to get started."
        eyebrow="FAQ"
        highlights={["Rush timing and services", "Pickup and delivery answers", "Quote and artwork guidance"]}
      />
      <section className="section-space">
        <div className="container-shell max-w-4xl">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Before you order",
                detail: "Use FAQ for service fit, turnaround, design help, and whether the job should start as a quote or direct order.",
              },
              {
                title: "Before you upload",
                detail: "Use artwork guidance for file types, bleed, safe areas, colour setup, and what happens after review.",
              },
              {
                title: "After you submit",
                detail: "Use support or order status when you need a faster answer on production, pickup, delivery, or payment.",
              },
            ].map((item) => (
              <article key={item.title} className="premium-surface p-5">
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="surface-card group p-6">
                <summary className="cursor-pointer list-none text-lg font-bold text-ink">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-brand transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
