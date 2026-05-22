import { Button } from "@/components/ui/button";
import { ProductActions } from "@/components/catalog/product-actions";
import { PrintProduct } from "@/types";

export function FinalCta({ product }: { product?: PrintProduct }) {
  return (
    <section className="bg-white pb-0 pt-8">
      <div className="container-shell">
        <div className="cta-sheen premium-cta relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand to-brand-deep p-8 text-white shadow-card sm:p-10 lg:p-12">
          <div className="absolute bottom-0 right-0 h-32 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <h2 className="text-balance text-3xl font-black leading-tight sm:text-4xl">
                {product ? `Ready to move forward with ${product.title.toLowerCase()}?` : "Not sure which print path is right?"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
                Send your files, share your deadline, or call PrintMe for practical guidance before you commit.
              </p>
            </div>
            <div className="relative flex flex-col gap-3 sm:flex-row">
              {product ? <ProductActions product={product} /> : <Button href="/quote-request" variant="secondary">Get My Quote</Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
