import { Suspense } from "react";

import { AuthShell } from "@/components/account/auth-shell";
import { AuthForm } from "@/components/account/auth-form";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Create Account",
  description: "Create a PrintMe customer account to manage quotes, orders, uploads, and repeat business tools.",
  path: "/account/create",
});

export default function CreateAccountPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your PrintMe customer account."
      description="Start with only your name, email, and password. Then use your account to track quotes, orders, uploads, saved details, and future repeat business."
      supportTitle="Want help before creating the account?"
      supportDetail="If you already have an order, quote, or upload in progress and you are not sure which email to use, contact the shop first so the right account gets connected to the right work."
    >
      <Suspense fallback={<div className="h-96 animate-pulse rounded-[1.8rem] bg-white shadow-soft" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  );
}
