"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/data/admin";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { BrandLogo } from "@/components/layout/brand-logo";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[1.7rem] border border-white/10 bg-ink p-4 text-white shadow-card lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
      <Link href="/admin" className="liquid-glass-dark block rounded-xl p-4">
        <BrandLogo size="header" inverted className="!rounded-none !ring-0 !ring-offset-0" />
        <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.35em] text-white/55">Operations</span>
      </Link>

      <nav className="mt-5 space-y-1" aria-label="Admin navigation">
        {adminNavItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-extrabold text-white/70 transition hover:bg-white/10 hover:text-white",
                active && "bg-white text-ink shadow-soft hover:bg-white hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="liquid-glass-dark mt-5 rounded-xl p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Staff note</p>
        <p className="mt-2 text-xs leading-5 text-white/65">
          Admin data is scaffolded for Supabase role-based access, status logs, and staff assignments.
        </p>
        <a href={siteConfig.phoneHref} className="mt-3 block text-sm font-black text-white">
          {siteConfig.phone}
        </a>
      </div>
    </aside>
  );
}
