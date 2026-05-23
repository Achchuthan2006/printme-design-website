import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/ui/icon";

export function ContactStrip() {
  const items = [
    { icon: "clock", title: "Fast turnaround", copy: "Rush-friendly timing for urgent local print needs." },
    { icon: "store", title: "In-store pickup", copy: "Convenient pickup from our Markham Road location." },
    { icon: "van", title: "Local delivery", copy: "Delivery options available for qualifying Toronto-area orders." },
  ];

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="surface-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
            <div className="bg-ink px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
              <p className="editorial-kicker text-brand-light">Visit or call</p>
              <h2 className="display-title mt-3 text-[2.2rem] font-black leading-[0.94] text-white">Local print support with a practical, friendly process</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                From quick document printing to custom signage and large-format work, we help businesses and walk-in customers move from idea to print-ready results.
              </p>
              <div className="mt-6 text-sm leading-7 text-white/80">
                <p>{siteConfig.address}</p>
                <p>{siteConfig.phone}</p>
              </div>
            </div>
            <div className="grid gap-px bg-line">
              {items.map((item) => (
                <div key={item.title} className="bg-panel px-6 py-6 sm:px-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/10 bg-brand-soft text-brand">
                    <Icon name={item.icon} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
