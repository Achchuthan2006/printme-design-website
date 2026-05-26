"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Pick<EngagementContextValue, "favorites" | "compare" | "recentlyViewed">>;
        setFavorites(parsed.favorites ?? []);
        setCompare(parsed.compare ?? []);
        setRecentlyViewed(parsed.recentlyViewed ?? []);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
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
    setFavorites((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current].slice(0, 12)));
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    setCompare((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      return [...current, slug].slice(-3);
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
