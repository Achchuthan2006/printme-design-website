"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { siteConfig } from "@/lib/site";

export function MobileBottomCta() {
  const { itemCount } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(20,20,20,0.1)] backdrop-blur transition-transform duration-300 md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <Button href="/quote-request" className="flex-1 px-4 py-3">
          Get Quote
        </Button>
        <Button href={itemCount > 0 ? "/cart" : siteConfig.phoneHref} variant="secondary" className="flex-1 px-4 py-3">
          {itemCount > 0 ? `View Cart (${itemCount})` : "Call Shop"}
        </Button>
      </div>
    </div>
  );
}
