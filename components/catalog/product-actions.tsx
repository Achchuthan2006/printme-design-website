import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { PrintProduct } from "@/types";

export function ProductActions({ product }: { product: PrintProduct }) {
  const uploadHref = `/quote-request?service=${product.slug}&method=upload-finished-design#upload`;
  const customDesignHref = `/quote-request?service=${product.slug}&method=request-custom-design`;

  if (product.ctaMode === "direct-order") {
    return (
      <>
        <Button href="#order-studio">Choose Order Method</Button>
        <Button href="#order-builder" variant="secondary">Jump to Specs</Button>
      </>
    );
  }

  if (product.ctaMode === "upload-first") {
    return (
      <>
        <Button href="#order-studio">Choose Order Method</Button>
        <Button href={uploadHref} variant="secondary">Upload Artwork for Review</Button>
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
      <Button href="#order-studio">Choose Order Method</Button>
      <Button href={customDesignHref} variant="secondary">Request Custom Design</Button>
    </>
  );
}
