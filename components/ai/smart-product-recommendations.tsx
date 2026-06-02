import Link from "next/link";
import { PrintProduct } from "@/types";
import { getRelatedProducts } from "@/data/products";

export function SmartProductRecommendations({ product }: { product: PrintProduct }) {
  const related = getRelatedProducts(product.related).slice(0, 3);

  if (!related.length) return null;

  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Related options</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {related.map((item) => (
          <Link key={item.slug} href={`/products/${item.slug}`} className="rounded-[1.2rem] border border-line bg-canvas p-4 transition hover:border-brand/20 hover:bg-white">
            <p className="text-sm font-black text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
