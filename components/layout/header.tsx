"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useAuth } from "@/components/account/auth-provider";
import { useCart } from "@/features/cart/cart-context";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const accountLabel = profile?.fullName ?? user?.email?.split("@")[0] ?? "Account";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!accountOpen) return;
    const handleClick = () => setAccountOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [accountOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/55 bg-[rgba(255,252,248,0.7)] backdrop-blur-[18px] transition-all duration-300 supports-[backdrop-filter]:bg-[rgba(255,252,248,0.64)]",
        scrolled ? "shadow-[0_22px_56px_rgba(22,19,17,0.12)]" : "shadow-[0_10px_30px_rgba(22,19,17,0.06)]",
      )}
    >
      <div className="hidden border-b border-white/10 bg-[linear-gradient(180deg,#201c1a_0%,#171413_100%)] text-white lg:block">
        <div className="container-shell flex h-11 items-center justify-between gap-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/66">
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
        <div className={cn("flex items-center justify-between gap-6 transition-[height] duration-300", scrolled ? "h-[68px]" : "h-[82px]")}>
          <BrandLogo className="mr-2 lg:mr-4" size="header" />

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full px-2 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink transition-colors duration-200 after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 hover:text-brand hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 lg:gap-3">
            <CartDrawer compact />
            <div className="hidden items-center gap-3 lg:flex">
              {!loading ? (
                user ? (
                  <div className="relative" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setAccountOpen((value) => !value)}
                      className="liquid-glass flex items-center gap-3 rounded-[1.35rem] px-4 py-2.5 text-left transition hover:border-brand/35"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ef6a46_0%,#d94620_75%,#b73314_100%)] text-xs font-black uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                        {accountLabel.slice(0, 1)}
                      </span>
                      <span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate">My account</span>
                        <span className="mt-0.5 block max-w-[9rem] truncate text-sm font-extrabold text-ink">{accountLabel}</span>
                      </span>
                    </button>
                    <div className={cn("absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[1.5rem] border border-white/75 bg-white/92 p-3 shadow-[0_24px_64px_rgba(18,17,16,0.14)] backdrop-blur-[16px] transition", accountOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0")}>
                      <div className="rounded-[1.15rem] border border-white/80 bg-white/84 px-3 py-3 text-xs leading-5 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <p className="font-black text-ink">{profile?.fullName ?? user.email}</p>
                        <p className="mt-1">Quotes, orders, uploads, and reorders all stay connected here.</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <Link href="/account" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Open dashboard</Link>
                        <Link href="/account/orders" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Orders and quotes</Link>
                        <Link href="/account/files" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Files and uploads</Link>
                        {isAdmin ? <Link href="/admin" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Admin portal</Link> : null}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut();
                          setAccountOpen(false);
                        }}
                        className="mt-3 w-full rounded-[1rem] border border-white/80 bg-white/84 px-3 py-2.5 text-sm font-bold text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition hover:text-brand"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button href="/account/login" variant="secondary" className="px-4 py-2.5 text-xs">Sign In</Button>
                    <Button href="/account/create" className="px-4 py-2.5 text-xs">Create Account</Button>
                  </div>
                )
              ) : null}
              <div className="liquid-glass rounded-[1.35rem] px-4 py-2.5 text-right">
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
            className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-[1.2rem] transition hover:border-brand/45 hover:bg-white lg:hidden"
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
                  className="rounded-[1.25rem] px-4 py-3 text-sm font-bold text-ink transition hover:bg-white/80 hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button href="/quote-request" className="mt-2 w-full justify-center">
                Request a Quote
              </Button>
              {user ? (
                <>
                  <Button href="/account" variant="secondary" className="w-full justify-center">
                    My Account
                  </Button>
                  {isAdmin ? <Button href="/admin" variant="secondary" className="w-full justify-center">Admin Portal</Button> : null}
                </>
              ) : (
                <>
                  <Button href="/account/login" variant="secondary" className="w-full justify-center">
                    Sign In
                  </Button>
                  <Button href="/account/create" variant="secondary" className="w-full justify-center">
                    Create Account
                  </Button>
                </>
              )}
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
