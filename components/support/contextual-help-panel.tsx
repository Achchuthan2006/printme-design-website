import Link from "next/link";

const contextCopy: Record<string, Array<{ title: string; description: string; href: string }>> = {
  artwork: [
    { title: "Quote-first if unsure", description: "Use the quote path when file quality or production fit is still unclear.", href: "/quote-request" },
    { title: "Support center", description: "Get help with file prep, proofs, and production questions.", href: "/support" },
    { title: "Payment and release", description: "Understand what still needs to be confirmed before production.", href: "/payment-info" },
  ],
  support: [
    { title: "Artwork guidance", description: "Check file setup before upload or proofing.", href: "/artwork-guidelines" },
    { title: "Quote-first help", description: "Use the guided quote path for custom jobs.", href: "/quote-request" },
    { title: "Order status", description: "Review the next step for an active job.", href: "/order-status" },
  ],
  quote: [
    { title: "Rush timing", description: "Share the real deadline so PrintMe can confirm what is realistic.", href: "/support" },
    { title: "Artwork not ready?", description: "You can still send the request and explain what is missing.", href: "/artwork-guidelines" },
    { title: "Need direct help?", description: "Call or contact the shop if the project is unclear.", href: "/contact" },
  ],
  product: [
    { title: "Need a quote instead?", description: "Use the quote flow when specs are still evolving.", href: "/quote-request" },
    { title: "Check file readiness", description: "Avoid common artwork issues before production.", href: "/artwork-guidelines" },
    { title: "Talk to support", description: "Get help choosing the cleanest next step.", href: "/support" },
  ],
  checkout: [
    { title: "Billing and payment", description: "Understand when PrintMe collects full payment, deposits, or review-first billing.", href: "/payment-info" },
    { title: "Pickup and delivery", description: "Review fulfillment timing before release.", href: "/pickup-delivery" },
    { title: "Need a quote path?", description: "Use quote-first when the job still needs review.", href: "/quote-request" },
  ],
};

export function ContextualHelpPanel({
  context,
  title = "Helpful next steps",
}: {
  context: "support" | "quote" | "product" | "checkout" | "artwork";
  title?: string;
}) {
  const items = contextCopy[context] ?? contextCopy.support;

  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Helpful context</p>
      <h2 className="mt-2 text-2xl font-black text-ink">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="rounded-[1.2rem] border border-line bg-canvas p-4 transition hover:border-brand/20 hover:bg-white">
            <p className="text-sm font-black text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
