import { Button } from "@/components/ui/button";
import { ProductActions } from "@/components/catalog/product-actions";
import { PrintProduct } from "@/types";

export function FinalCta({ product }: { product?: PrintProduct }) {
  return (
    <section className="bg-white pb-0 pt-8">
      <div className="container-shell">
        <div className="cta-sheen relative overflow-hidden rounded-lg bg-brand p-8 text-white shadow-card sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-balance text-3xl font-black leading-tight sm:text-4xl">
                {product ? `Ready to start ${product.title.toLowerCase()}?` : "Need help choosing the right print service?"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                Send your files, request a quote, or call PrintMe for practical local guidance before production.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {product ? <ProductActions product={product} /> : <Button href="/quote-request" variant="secondary">Request Quote</Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
