import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { PrintProduct } from "@/types";

export function ProductActions({ product }: { product: PrintProduct }) {
  const uploadHref = `/quote-request?service=${product.slug}#upload`;

  if (product.ctaMode === "direct-order") {
    return (
      <>
        <Button href="#order-builder">Start My Order</Button>
        <Button href={`/quote-request?service=${product.slug}`} variant="secondary">Request a Quote First</Button>
      </>
    );
  }

  if (product.ctaMode === "upload-first") {
    return (
      <>
        <Button href={uploadHref}>Upload My Artwork</Button>
        <Button href={`/quote-request?service=${product.slug}`} variant="secondary">Request a Quote First</Button>
      </>
    );
  }

  if (product.ctaMode === "contact") {
    return (
      <>
        <Button href={siteConfig.phoneHref}>Call PrintMe</Button>
        <Button href="/contact" variant="secondary">Plan My Visit</Button>
      </>
    );
  }

  return (
    <>
      <Button href={`/quote-request?service=${product.slug}`}>Request a Quote</Button>
      <Button href={siteConfig.phoneHref} variant="secondary">Talk to PrintMe</Button>
    </>
  );
}
