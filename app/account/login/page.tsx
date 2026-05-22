import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Login",
  description: "Sign in to your PrintMe customer account.",
  path: "/account/login",
});

export default function LoginPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-xl">
        <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-black text-ink">Customer login</h1>
          <p className="mt-2 text-sm text-slate">Supabase Auth scaffold for login, signup, forgot password, and email verification.</p>
          <div className="mt-6 space-y-4">
            <input placeholder="Email" className="w-full rounded-lg border border-line px-4 py-3 text-sm" />
            <input placeholder="Password" type="password" className="w-full rounded-lg border border-line px-4 py-3 text-sm" />
            <Button className="w-full">Sign In</Button>
            <Button href="/account" variant="secondary" className="w-full">Preview Dashboard</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
