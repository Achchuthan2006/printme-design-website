import { AuthShell } from "@/components/account/auth-shell";
import { ForgotPasswordForm } from "@/components/account/password-forms";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Forgot Password",
  description: "Reset your PrintMe account password.",
  path: "/account/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Forgot password"
      title="Recover access without losing context."
      description="Use your account email to request a reset link, then come back to your quotes, orders, uploads, and customer portal with minimal friction."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
