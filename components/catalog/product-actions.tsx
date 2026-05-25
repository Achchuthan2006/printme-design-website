import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { PrintProduct } from "@/types";

export function ProductActions({ product }: { product: PrintProduct }) {
  const uploadHref = `/quote-request?service=${product.slug}#upload`;

  if (product.ctaMode === "direct-order") {
    return (
      <>
        <Button href="#order-builder">Order Online Now</Button>
        <Button href={uploadHref} variant="secondary">Upload Artwork First</Button>
      </>
    );
  }

  if (product.ctaMode === "upload-first") {
    return (
      <>
        <Button href={uploadHref}>Upload Artwork for Review</Button>
        <Button href={`/quote-request?service=${product.slug}`} variant="secondary">Start with a Quote</Button>
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
      <Button href={`/quote-request?service=${product.slug}`}>Get a Custom Quote</Button>
      <Button href={siteConfig.phoneHref} variant="secondary">Call About This Job</Button>
    </>
  );
}
