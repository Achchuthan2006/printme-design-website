import { ResetPasswordForm } from "@/components/account/password-forms";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Reset Password",
  description: "Choose a new PrintMe account password.",
  path: "/account/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-xl">
        <ResetPasswordForm />
      </div>
    </section>
  );
}
