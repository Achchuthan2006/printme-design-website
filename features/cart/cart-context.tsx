"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  lastAddedItem: CartItem | null;
  dismissLastAddedItem: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "printme-cart";

function isSameCartConfiguration(current: CartItem, next: Omit<CartItem, "id">) {
  return (
    current.productSlug === next.productSlug &&
    current.notes === next.notes &&
    current.fulfillmentMethod === next.fulfillmentMethod &&
    current.turnaround === next.turnaround &&
    JSON.stringify(current.options) === JSON.stringify(next.options)
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CartItem>[];
        setItems(
          parsed
            .filter((item) => item.id && item.productSlug && item.title)
            .map((item) => ({
              id: item.id ?? crypto.randomUUID(),
              productSlug: item.productSlug ?? "",
              title: item.title ?? "Print item",
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice ?? 0,
              estimatedTotal: item.estimatedTotal ?? item.unitPrice ?? 0,
              pricingMode: item.pricingMode ?? "starting-from",
              mode: item.mode ?? "hybrid",
              options: item.options ?? {},
              optionLabels: item.optionLabels ?? [],
              notes: item.notes,
              fulfillmentMethod: item.fulfillmentMethod,
              turnaround: item.turnaround,
              quoteOnly: item.quoteOnly ?? item.pricingMode === "quote-only",
            })),
        );
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
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore storage failures so cart interactions still work in-memory.
    }
  }, [hydrated, items]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const openCart = useCallback(() => setIsDrawerOpen(true), []);
  const closeCart = useCallback(() => setIsDrawerOpen(false), []);
  const dismissLastAddedItem = useCallback(() => setLastAddedItem(null), []);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setItems((current) => {
      const existing = current.find((currentItem) => isSameCartConfiguration(currentItem, item));

      if (existing) {
        const mergedItem = {
          ...existing,
          quantity: existing.quantity + item.quantity,
        };
        setLastAddedItem(mergedItem);
        return current.map((currentItem) => (currentItem.id === existing.id ? mergedItem : currentItem));
      }

      const nextItem: CartItem = {
        ...item,
        id: crypto.randomUUID(),
      };

      setLastAddedItem(nextItem);
      return [...current, nextItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      setLastAddedItem((lastItem) => (lastItem?.id === id ? null : lastItem));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setLastAddedItem(null);
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    subtotal,
    itemCount,
    isDrawerOpen,
    openCart,
    closeCart,
    lastAddedItem,
    dismissLastAddedItem,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }), [
    addItem,
    clearCart,
    closeCart,
    dismissLastAddedItem,
    isDrawerOpen,
    itemCount,
    items,
    lastAddedItem,
    openCart,
    removeItem,
    subtotal,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
