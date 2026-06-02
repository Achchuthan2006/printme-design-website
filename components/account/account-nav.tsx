"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/account/auth-provider";
import { Card } from "@/components/ui/card";
import { NavItemLink, NavList } from "@/components/ui/navigation";

const navItems = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Proofs", href: "/account/proofs" },
  { label: "Quotes", href: "/account/quotes" },
  { label: "Reorders", href: "/account/reorders" },
  { label: "Files", href: "/account/files" },
  { label: "Invoices", href: "/account/invoices" },
  { label: "Settings", href: "/account/settings" },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user, configured, isAdmin } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/account/login");
  }

  return (
    <Card as="aside" variant="panel" className="h-fit p-4 lg:sticky lg:top-24">
      <p className="px-3 text-[11px] font-black uppercase tracking-[0.22em] text-brand">Customer account</p>
      <p className="mt-2 px-3 text-sm font-bold text-ink">{user?.email ?? "Demo account preview"}</p>
      {isAdmin ? (
        <p className="mt-3 rounded-[1rem] border border-brand/15 bg-brand-soft px-3 py-2 text-xs font-bold leading-5 text-brand">
          Staff-approved account detected. You can also open the internal operations portal.
        </p>
      ) : null}
      {!configured ? (
        <p className="mt-3 rounded-[1rem] bg-brand-soft px-3 py-2 text-xs leading-5 text-brand">
          Supabase env vars are not configured, so account pages are shown in preview mode.
        </p>
      ) : null}
      <NavList className="mt-4">
        {navItems.map((item) => (
          <NavItemLink
            key={item.href}
            href={item.href}
            active={pathname === item.href}
          >
            {item.label}
          </NavItemLink>
        ))}
      </NavList>
      <Card variant="ghost" className="mt-5 rounded-[1rem] bg-canvas px-3 py-3 text-xs leading-5 text-slate">
        <p className="font-black text-ink">Platform quick paths</p>
        <p className="mt-1">Orders, quotes, files, invoices, and support are intentionally separated so repeat customers can move faster without losing context.</p>
      </Card>
      {isAdmin ? (
        <Button href="/admin" variant="secondary" className="mt-5 w-full">
          Open Admin Portal
        </Button>
      ) : null}
      <Button href="/products" variant="secondary" className={isAdmin ? "mt-3 w-full" : "mt-5 w-full"}>Start New Order</Button>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-3 w-full rounded-[1rem] px-3 py-2 text-sm font-bold text-slate transition hover:bg-canvas hover:text-brand"
      >
        Sign out
      </button>
    </Card>
  );
}
