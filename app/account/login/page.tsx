import { Suspense } from "react";
import { AuthForm } from "@/components/account/auth-form";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Login",
  description: "Sign in or create a PrintMe customer account.",
  path: "/account/login",
});

export default function LoginPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-xl">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white shadow-soft" />}>
          <AuthForm />
        </Suspense>
      </div>
    </section>
  );
}
