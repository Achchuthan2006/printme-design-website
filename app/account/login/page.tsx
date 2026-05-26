import { Suspense } from "react";
import { AuthShell } from "@/components/account/auth-shell";
import { AuthForm } from "@/components/account/auth-form";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Login",
  description: "Sign in or create a PrintMe customer account.",
  path: "/account/login",
});

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Access your PrintMe customer portal."
      description="Sign in to continue to your dashboard, quotes, orders, uploads, addresses, and repeat-order tools."
    >
      <Suspense fallback={<div className="h-96 animate-pulse rounded-[1.8rem] bg-white shadow-soft" />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
