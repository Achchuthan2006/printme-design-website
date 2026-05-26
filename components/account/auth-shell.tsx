import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  supportTitle = "Need help before you sign in?",
  supportDetail = "If you are trying to check an order, recover an account, or confirm the right next step, call or message the shop and we will help you get back into the right workflow quickly.",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  supportTitle?: string;
  supportDetail?: string;
}) {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <aside className="hero-panel p-6 sm:p-8">
            <p className="editorial-kicker">{eyebrow}</p>
            <h1 className="display-title mt-4 max-w-[12ch] text-balance text-[2.8rem] font-semibold leading-[0.9] sm:text-[4.1rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-slate sm:text-base">{description}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Track quotes, orders, and uploads in one account",
                "Keep saved details ready for faster repeat jobs",
                "See status, invoices, and support paths more clearly",
                "Get back to active print work without extra back-and-forth",
              ].map((item) => (
                <div key={item} className="signal-card p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <p className="text-sm leading-6 text-slate">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 liquid-glass rounded-[1.6rem] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Local support</p>
              <h2 className="mt-2 text-lg font-black text-ink">{supportTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate">{supportDetail}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button href={siteConfig.phoneHref} className="px-4 py-2.5 text-xs">Call {siteConfig.phone}</Button>
                <Button href="/support" variant="secondary" className="px-4 py-2.5 text-xs">Get Support</Button>
              </div>
              <div className="mt-4 text-xs leading-5 text-slate">
                <p className="font-black text-ink">{siteConfig.shortAddress}</p>
                <p className="mt-1">By creating an account, you agree to the <Link href="/terms" className="font-bold text-brand hover:text-brand-dark">Terms</Link> and <Link href="/privacy" className="font-bold text-brand hover:text-brand-dark">Privacy Policy</Link>.</p>
              </div>
            </div>
          </aside>

          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
