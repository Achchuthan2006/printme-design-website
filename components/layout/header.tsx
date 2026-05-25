"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useCart } from "@/features/cart/cart-context";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line/70 bg-white/92 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-white/84",
        scrolled ? "shadow-[0_18px_48px_rgba(22,19,17,0.1)]" : "shadow-[0_6px_22px_rgba(22,19,17,0.045)]",
      )}
    >
      <div className="hidden border-b border-black/5 bg-ink text-white lg:block">
        <div className="container-shell flex h-10 items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
          <div className="flex items-center gap-5">
            <span>Scarborough print shop</span>
            <span>{siteConfig.experience}</span>
            <span>Quotes, uploads, and local pickup</span>
          </div>
          <div className="flex items-center gap-5">
            <a href={siteConfig.phoneHref} className="link-underline text-white">
              {siteConfig.phone}
            </a>
            <span>{siteConfig.shortAddress}</span>
          </div>
        </div>
      </div>
      <div className="container-shell">
        <div className={cn("flex items-center justify-between gap-6 transition-[height] duration-300", scrolled ? "h-[64px]" : "h-[76px]")}>
          <BrandLogo className="mr-2 lg:mr-4" size="header" />

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full px-1 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-ink transition-colors duration-200 after:absolute after:bottom-0 after:left-1 after:h-0.5 after:w-[calc(100%-0.5rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 hover:text-brand hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 lg:gap-3">
            <CartDrawer compact />
            <div className="hidden items-center gap-3 lg:flex">
              <div className="rounded-full border border-line/80 bg-white px-4 py-2 text-right shadow-[0_10px_20px_rgba(22,19,17,0.05)]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Need a fast answer?</p>
                <a href={siteConfig.phoneHref} className="mt-1 block text-sm font-extrabold text-ink transition hover:text-brand">
                  {siteConfig.phone}
                </a>
              </div>
              <Button href="/quote-request" className="px-5 py-2.5 text-xs">
                Request a Quote
                <span aria-hidden="true" className="ml-2">-&gt;</span>
              </Button>
            </div>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="printme-mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-2xl transition hover:border-brand/45 hover:bg-white lg:hidden"
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
          id="printme-mobile-menu"
          className={cn(
            "grid border-t border-white/60 transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="py-4">
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-ink transition hover:bg-white/80 hover:text-brand"
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
