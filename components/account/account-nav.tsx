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
  { label: "Files", href: "/account/files" },
  { label: "Invoices", href: "/account/invoices" },
  { label: "Settings", href: "/account/settings" },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user, configured } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/account/login");
  }

  return (
    <aside className="h-fit rounded-lg border border-line bg-white p-4 shadow-soft lg:sticky lg:top-24">
      <p className="px-3 text-xs font-black uppercase tracking-[0.2em] text-brand">Customer account</p>
      <p className="mt-2 px-3 text-sm font-bold text-ink">{user?.email ?? "Demo account preview"}</p>
      {!configured ? (
        <p className="mt-3 rounded-md bg-brand-soft px-3 py-2 text-xs leading-5 text-brand">
          Supabase env vars are not configured, so account pages are shown in preview mode.
        </p>
      ) : null}
      <nav className="mt-4 grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand",
              pathname === item.href && "bg-brand-soft text-brand",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Button href="/products" variant="secondary" className="mt-5 w-full">Start New Order</Button>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-3 w-full rounded-md px-3 py-2 text-sm font-bold text-slate transition hover:bg-canvas hover:text-brand"
      >
        Sign out
      </button>
    </aside>
  );
}
