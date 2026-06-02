import { PrintProduct } from "@/types";

export function FileReadinessAssistant({ product }: { product: PrintProduct }) {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">File readiness</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Common file checks for {product.title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate">
        {product.fileRequirements.slice(0, 4).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
