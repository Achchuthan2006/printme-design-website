import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { PrintProduct } from "@/types";

export function ProductActions({ product }: { product: PrintProduct }) {
  const uploadHref = `/quote-request?service=${product.slug}#upload`;

  if (product.ctaMode === "direct-order") {
    return (
      <>
        <Button href="#order-builder">Add to Cart</Button>
        <Button href="/quote-request" variant="secondary">Request Quote</Button>
      </>
    );
  }

  if (product.ctaMode === "upload-first") {
    return (
      <>
        <Button href={uploadHref}>Upload Artwork</Button>
        <Button href="/quote-request" variant="secondary">Request Quote</Button>
      </>
    );
  }

  if (product.ctaMode === "contact") {
    return (
      <>
        <Button href={siteConfig.phoneHref}>Call Now</Button>
        <Button href="/contact" variant="secondary">Contact Us</Button>
      </>
    );
  }

  return (
    <>
      <Button href="/quote-request">Request Quote</Button>
      <Button href={siteConfig.phoneHref} variant="secondary">Call Now</Button>
    </>
  );
}
