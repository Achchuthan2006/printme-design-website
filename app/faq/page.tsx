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
