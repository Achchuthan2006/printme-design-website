import { Button } from "@/components/ui/button";
import { ProductActions } from "@/components/catalog/product-actions";
import { PrintProduct } from "@/types";

export function FinalCta({ product }: { product?: PrintProduct }) {
  return (
    <section className="bg-white pb-0 pt-8">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white shadow-card sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.30),transparent_18rem),linear-gradient(135deg,rgba(255,255,255,0.02),transparent)]" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-32 w-64 rounded-full bg-white/8 blur-3xl" aria-hidden="true" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <p className="editorial-kicker !text-brand-light">Ready to move</p>
              <h2 className="display-title mt-3 text-balance text-[2.2rem] font-black leading-[0.94] !text-white sm:text-[3rem]">
                {product ? `Ready to move forward with ${product.title.toLowerCase()}?` : "Not sure which print path is right?"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 !text-white/80">
                Send your files, share your deadline, or call PrintMe for practical guidance before you commit.
              </p>
            </div>
            <div className="relative flex flex-col gap-3 sm:flex-row">
              {product ? <ProductActions product={product} /> : <Button href="/quote-request" variant="secondary">Request a Quote</Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
