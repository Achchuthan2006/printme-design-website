import { ForgotPasswordForm } from "@/components/account/password-forms";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Forgot Password",
  description: "Reset your PrintMe account password.",
  path: "/account/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-xl">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
