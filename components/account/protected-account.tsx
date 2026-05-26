"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/account/auth-provider";
import { AccountNav } from "@/components/account/account-nav";

export function ProtectedAccount({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="h-80 animate-pulse rounded-lg bg-white shadow-soft" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-lg bg-white shadow-soft" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-36 animate-pulse rounded-lg bg-white shadow-soft" />
            <div className="h-36 animate-pulse rounded-lg bg-white shadow-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (configured && !user) {
    return (
      <div className="hero-panel p-8 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Account required</p>
        <h1 className="display-title mt-4 text-3xl font-semibold text-ink sm:text-[3rem]">Sign in to view your PrintMe account.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate">
          Customer dashboards are protected. Sign in to access orders, quotes, uploads, invoices, settings, and reorder tools.
        </p>
        <div className="mx-auto mt-6 grid max-w-3xl gap-3 md:grid-cols-3">
          {[
            "Track quotes and orders from one dashboard",
            "Keep uploads and saved details attached to the right account",
            "Reduce repeat-order friction for future print work",
          ].map((item) => (
            <div key={item} className="signal-card p-4 text-sm leading-6 text-slate">{item}</div>
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={`/account/login?redirect=${encodeURIComponent(pathname)}`}>Sign In</Button>
          <Button href={`/account/create?redirect=${encodeURIComponent(pathname)}`} variant="secondary">Create Account</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <AccountNav />
      <section>{children}</section>
    </div>
  );
}
