import { AccountWidget } from "@/types";

const widgets: AccountWidget[] = [
  { title: "Open Orders", value: "0", description: "Track active print orders once Supabase auth is connected." },
  { title: "Saved Quotes", value: "0", description: "Quotes will appear here for approval and payment." },
  { title: "Uploaded Files", value: "0", description: "Artwork storage will connect to Supabase Storage." },
  { title: "Invoices", value: "0", description: "Invoice downloads are prepared for the order system." },
];

export function AccountShell() {
  const tabs = ["Overview", "Orders", "Quotes", "Files", "Invoices", "Account Settings"];

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-lg border border-line bg-white p-4 shadow-soft">
        <p className="px-3 text-xs font-black uppercase tracking-[0.2em] text-brand">Customer account</p>
        <nav className="mt-4 grid gap-1">
          {tabs.map((tab) => (
            <a key={tab} href="#" className="rounded-md px-3 py-2 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">
              {tab}
            </a>
          ))}
        </nav>
      </aside>
      <section>
        <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-black text-ink">Account dashboard</h1>
          <p className="mt-2 text-sm text-slate">Supabase Auth will power sign in, profiles, order history, invoice access, and quick reorders.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {widgets.map((widget) => (
            <article key={widget.title} className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <p className="text-sm font-bold text-slate">{widget.title}</p>
              <p className="mt-3 text-3xl font-black text-ink">{widget.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{widget.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
