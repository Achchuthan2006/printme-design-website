import { AccountShell } from "@/components/account/account-shell";
import { buildMetadata } from "@/lib/metadata";
import { ProtectedAccount } from "@/components/account/protected-account";

export const metadata = buildMetadata({
  title: "Account",
  description: "PrintMe customer account dashboard for orders, quotes, files, invoices, and reorders.",
  path: "/account",
});

export default function AccountPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <AccountShell />
        </ProtectedAccount>
      </div>
    </section>
  );
}
