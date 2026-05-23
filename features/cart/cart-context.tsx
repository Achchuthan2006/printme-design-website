"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;

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
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore storage failures so cart interactions still work in-memory.
    }
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    subtotal,
    itemCount,
    isDrawerOpen,
    openCart: () => setIsDrawerOpen(true),
    closeCart: () => setIsDrawerOpen(false),
    lastAddedItem,
    dismissLastAddedItem: () => setLastAddedItem(null),
    addItem: (item) => {
      const nextItem: CartItem = {
        ...item,
        id: crypto.randomUUID(),
      };

      setItems((current) => [
        ...current,
        nextItem,
      ]);
      setLastAddedItem(nextItem);
    },
    removeItem: (id) =>
      setItems((current) => {
        const next = current.filter((item) => item.id !== id);
        if (lastAddedItem?.id === id) setLastAddedItem(null);
        return next;
      }),
    updateQuantity: (id, quantity) =>
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
      ),
    clearCart: () => {
      setItems([]);
      setLastAddedItem(null);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
