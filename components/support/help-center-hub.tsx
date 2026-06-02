import Link from "next/link";

const helpItems = [
  {
    title: "Quotes and custom jobs",
    description: "Use the quote flow when the format, finish, or file still needs guidance.",
    href: "/quote-request",
  },
  {
    title: "Artwork and file prep",
    description: "Review file basics before production or proofing starts.",
    href: "/artwork-guidelines",
  },
  {
    title: "Pickup, delivery, and timing",
    description: "Understand how fulfillment works before release.",
    href: "/pickup-delivery",
  },
  {
    title: "Payment and billing",
    description: "See when PrintMe uses direct checkout, deposits, or review-first billing.",
    href: "/payment-info",
  },
];

export function HelpCenterHub() {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Help center</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Use the strongest self-service route first</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {helpItems.map((item) => (
          <Link key={item.title} href={item.href} className="rounded-[1.2rem] border border-line bg-canvas p-4 transition hover:border-brand/20 hover:bg-white">
            <p className="text-sm font-black text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
