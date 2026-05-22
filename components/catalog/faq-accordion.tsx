import { FaqItem } from "@/types";

export function FaqAccordion({ items, title = "Product FAQ" }: { items: FaqItem[]; title?: string }) {
  return (
    <section>
      <h2 className="text-3xl font-black text-ink">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((faq) => (
          <details key={faq.question} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <summary className="cursor-pointer text-sm font-black text-ink">{faq.question}</summary>
            <p className="mt-3 text-sm leading-6 text-slate">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
