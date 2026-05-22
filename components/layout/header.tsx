"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useCart } from "@/features/cart/cart-context";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-white/88",
        scrolled ? "shadow-[0_10px_30px_rgba(20,20,20,0.08)]" : "shadow-[0_4px_18px_rgba(20,20,20,0.04)]",
      )}
    >
      <div className="container-shell">
        <div className="flex h-16 items-center justify-between gap-6">
          <BrandLogo />

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-xs font-extrabold text-ink transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:text-brand hover:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={siteConfig.phoneHref} className="text-xs font-extrabold text-ink transition hover:text-brand">
              {siteConfig.phone}
            </a>
            <CartDrawer />
            <Button href="/quote-request" className="px-5 py-2.5 text-xs">
              Request a Quote
              <span aria-hidden="true" className="ml-2">-&gt;</span>
            </Button>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white transition hover:border-brand/50 hover:bg-brand-soft lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className={cn("block h-0.5 w-5 bg-ink transition", open && "translate-y-2 rotate-45")} />
              <span className={cn("block h-0.5 w-5 bg-ink transition", open && "opacity-0")} />
              <span className={cn("block h-0.5 w-5 bg-ink transition", open && "-translate-y-2 -rotate-45")} />
            </div>
          </button>
        </div>

        <div
          className={cn(
            "grid border-t border-line transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="py-4">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-4 py-3 text-sm font-bold text-ink transition hover:bg-canvas hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button href="/quote-request" className="mt-2 w-full justify-center">
                Request a Quote
              </Button>
              <Button href="/cart" variant="secondary" className="w-full justify-center">
                Cart {itemCount > 0 ? `(${itemCount})` : ""}
              </Button>
            </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
