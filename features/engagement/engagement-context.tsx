"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { trackPrintMeEvent } from "@/lib/analytics/client";

type EngagementContextValue = {
  favorites: string[];
  compare: string[];
  recentlyViewed: string[];
  toggleFavorite: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  markViewedProduct: (slug: string) => void;
  clearCompare: () => void;
};

const storageKey = "printme-engagement";
const EngagementContext = createContext<EngagementContextValue | null>(null);

function createEmptyEngagementState() {
  return {
    favorites: [] as string[],
    compare: [] as string[],
    recentlyViewed: [] as string[],
  };
}

function readStoredEngagement() {
  if (typeof window === "undefined") {
    return createEmptyEngagementState();
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return createEmptyEngagementState();
    }

    const parsed = JSON.parse(saved) as Partial<Pick<EngagementContextValue, "favorites" | "compare" | "recentlyViewed">>;
    return {
      favorites: parsed.favorites ?? [],
      compare: parsed.compare ?? [],
      recentlyViewed: parsed.recentlyViewed ?? [],
    };
  } catch {
    window.localStorage.removeItem(storageKey);
    return createEmptyEngagementState();
  }
}

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const initialState = readStoredEngagement();
      setFavorites(initialState.favorites);
      setCompare(initialState.compare);
      setRecentlyViewed(initialState.recentlyViewed);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ favorites, compare, recentlyViewed }),
      );
    } catch {
      // Ignore storage failures so engagement helpers still work in-memory.
    }
  }, [compare, favorites, hydrated, recentlyViewed]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current].slice(0, 12);
      trackPrintMeEvent({
        eventName: "product_saved",
        pageType: "product",
        isMicroConversion: true,
        properties: {
          productSlug: slug,
          saved: next.includes(slug),
        },
      });
      return next;
    });
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    setCompare((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug].slice(-3);
      trackPrintMeEvent({
        eventName: "product_compared",
        pageType: "product",
        isMicroConversion: true,
        properties: {
          productSlug: slug,
          compared: next.includes(slug),
          compareCount: next.length,
        },
      });
      return next;
    });
  }, []);

  const markViewedProduct = useCallback((slug: string) => {
    setRecentlyViewed((current) => [slug, ...current.filter((item) => item !== slug)].slice(0, 8));
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const value = useMemo<EngagementContextValue>(
    () => ({
      favorites,
      compare,
      recentlyViewed,
      toggleFavorite,
      toggleCompare,
      markViewedProduct,
      clearCompare,
    }),
    [clearCompare, compare, favorites, markViewedProduct, recentlyViewed, toggleCompare, toggleFavorite],
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) throw new Error("useEngagement must be used inside EngagementProvider");
  return context;
}
