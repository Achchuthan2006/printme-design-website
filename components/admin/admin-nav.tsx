"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/data/admin";
import { siteConfig } from "@/lib/site";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Card } from "@/components/ui/card";
import { NavItemLink, NavList } from "@/components/ui/navigation";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <Card as="aside" variant="dark" className="lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
      <Link href="/admin" className="premium-focus liquid-glass-dark block rounded-xl p-4">
        <BrandLogo size="header" inverted className="!rounded-none !ring-0 !ring-offset-0" />
        <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.35em] text-white/55">Operations</span>
      </Link>

      <NavList className="mt-5" aria-label="Admin navigation">
        {adminNavItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <NavItemLink
              key={item.href}
              href={item.href}
              tone="inverse"
              active={active}
              className="rounded-xl px-4 py-3 text-sm font-extrabold"
            >
              {item.label}
            </NavItemLink>
          );
        })}
      </NavList>

      <Card variant="dark" className="mt-5 rounded-xl p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Staff note</p>
        <p className="mt-2 text-xs leading-5 text-white/65">
          Admin data is scaffolded for Supabase role-based access, status logs, and staff assignments.
        </p>
        <a href={siteConfig.phoneHref} className="mt-3 block text-sm font-black text-white">
          {siteConfig.phone}
        </a>
      </Card>
    </Card>
  );
}
