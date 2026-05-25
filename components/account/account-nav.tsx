"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/account/auth-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
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
    <aside className="hero-panel h-fit p-4 lg:sticky lg:top-24">
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
      <nav className="mt-4 grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand",
              pathname === item.href && "bg-ink text-white hover:bg-ink hover:text-white",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-5 rounded-[1rem] border border-line bg-canvas px-3 py-3 text-xs leading-5 text-slate">
        <p className="font-black text-ink">Platform quick paths</p>
        <p className="mt-1">Orders, quotes, files, invoices, and support are intentionally separated so repeat customers can move faster without losing context.</p>
      </div>
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
    </aside>
  );
}
