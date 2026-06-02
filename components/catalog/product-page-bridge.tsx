"use client";

import { useEffect } from "react";
import { useEngagement } from "@/features/engagement/engagement-context";
import { trackPrintMeEvent } from "@/lib/analytics/client";

export function ProductPageBridge({ slug, categorySlug }: { slug: string; categorySlug: string }) {
  const { markViewedProduct } = useEngagement();

  useEffect(() => {
    markViewedProduct(slug);
    trackPrintMeEvent({
      eventName: "product_viewed",
      pageType: "product",
      funnelName: "storefront_discovery",
      funnelStage: "product_detail",
      journey: "storefront_discovery",
      isMicroConversion: true,
      properties: {
        productSlug: slug,
        categorySlug,
      },
    });
  }, [categorySlug, markViewedProduct, slug]);

  return null;
}
