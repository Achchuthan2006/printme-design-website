import { AuthShell } from "@/components/account/auth-shell";
import { ResetPasswordForm } from "@/components/account/password-forms";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Reset Password",
  description: "Choose a new PrintMe account password.",
  path: "/account/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset password"
      title="Choose a fresh secure password."
      description="Reset access cleanly, then return to your dashboard, active print work, and saved customer details."
      supportTitle="Need help with account recovery?"
      supportDetail="If the reset link is not arriving or the wrong email was used on a quote or order, contact PrintMe so we can help reconnect the account before the project timeline slips."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
