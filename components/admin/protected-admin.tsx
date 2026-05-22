"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/account/auth-provider";

export function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="grid min-h-screen gap-6 bg-cream p-4 lg:grid-cols-[280px_1fr] lg:p-6">
        <div className="h-96 animate-pulse rounded-2xl bg-ink/90" />
        <div className="space-y-4">
          <div className="h-44 animate-pulse rounded-2xl bg-white shadow-soft" />
          <div className="grid gap-4 md:grid-cols-4">
            <div className="h-32 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-32 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-32 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-32 animate-pulse rounded-2xl bg-white shadow-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (configured && !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-cream px-4">
        <section className="max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Admin access</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink">Sign in to manage PrintMe operations.</h1>
          <p className="mt-3 text-sm leading-7 text-slate">
            The internal dashboard is separated from customer accounts and prepared for Supabase role-based access.
          </p>
          <Button href={`/account/login?redirect=${encodeURIComponent(pathname)}`} className="mt-6">
            Sign In as Staff
          </Button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 lg:p-6">
      <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
        <AdminNav />
        <section>{children}</section>
      </div>
    </div>
  );
}
