"use client";

import { useEffect } from "react";
import { useEngagement } from "@/features/engagement/engagement-context";

export function ProductPageBridge({ slug }: { slug: string }) {
  const { markViewedProduct } = useEngagement();

  useEffect(() => {
    markViewedProduct(slug);
  }, [markViewedProduct, slug]);

  return null;
}
