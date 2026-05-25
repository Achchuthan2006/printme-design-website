import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { PrintProduct } from "@/types";

export function RelatedServices({ products, title = "Related services" }: { products: PrintProduct[]; title?: string }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white section-space">
      <div className="container-shell">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-ink">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
              Customers often pair this service with these print products for a more complete business or campaign package.
            </p>
          </div>
          <Button href="/services" variant="secondary">Compare Services</Button>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
