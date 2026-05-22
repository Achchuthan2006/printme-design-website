import { ProductCard } from "@/components/commerce/product-card";
import { PrintProduct } from "@/types";

export function RelatedServices({ products }: { products: PrintProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white section-space">
      <div className="container-shell">
        <h2 className="text-3xl font-black text-ink">Related services</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
          Customers often pair this service with these print products for a more complete business or campaign package.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
