import { FaqItem } from "@/types";

export function FaqAccordion({ items, title = "Product FAQ" }: { items: FaqItem[]; title?: string }) {
  return (
    <section>
      <p className="editorial-kicker">Answers</p>
      <h2 className="display-title mt-3 text-[2.25rem] font-semibold leading-[0.92]">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((faq) => (
          <details key={faq.question} className="premium-surface group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-black text-ink">
              <span>{faq.question}</span>
              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/85 bg-white/88 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 text-sm leading-6 text-slate">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
