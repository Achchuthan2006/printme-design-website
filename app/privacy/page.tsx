import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How PrintMe Design handles customer contact details, quote requests, artwork uploads, account information, and payment-related data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" description="How PrintMe handles quote, order, account, artwork, and contact information." />
      <section className="section-space bg-canvas">
        <div className="container-shell max-w-3xl rounded-2xl border border-line/90 bg-white p-6 text-sm leading-7 text-slate shadow-soft">
          <p>PrintMe Design collects the information needed to respond to quote requests, process orders, manage customer accounts, review uploaded artwork, and provide customer support.</p>
          <p className="mt-4">This may include your name, company name, email, phone number, project details, uploaded files, delivery or pickup preferences, and payment-related status from secure payment providers.</p>
          <p className="mt-4">We use this information to complete your request, communicate about your print project, prevent abuse of our forms and upload systems, maintain account records, and improve the customer experience.</p>
          <p className="mt-4">Payment card data is handled by secure payment providers such as Stripe. PrintMe does not store full card numbers in this website application.</p>
          <p className="mt-4">Uploaded artwork, quote records, order records, and account data are kept only as long as needed to support your work with PrintMe, meet operational requirements, and maintain internal business records.</p>
          <p className="mt-4">If you need help updating your account details, clarifying stored project information, or asking a privacy question, contact {siteConfig.email} or call {siteConfig.phone}.</p>
        </div>
      </section>
    </>
  );
}
