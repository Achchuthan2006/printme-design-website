import Link from "next/link";
import { localLandingPages } from "@/data/cro";
import { navigation, serviceOptions, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#12100f] pb-20 text-white md:pb-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/55 to-transparent" aria-hidden="true" />
      <div className="absolute -right-32 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" aria-hidden="true" />
      <div className="absolute left-0 top-28 h-56 w-56 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
      <div className="container-shell py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
          <div className="mb-8 grid gap-4 xl:grid-cols-3">
            {[
              "Quote-first support for custom print work",
              "Pickup confidence from a real Scarborough shop",
              "Production guidance before you spend money on the wrong path",
            ].map((item) => (
              <div key={item} className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                {item}
              </div>
            ))}
          </div>
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.35fr_0.72fr_0.8fr_1fr]">
          <div className="space-y-5">
            <div>
              <BrandLogo inverted size="footer" />
              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                Premium local print production for businesses, events, documents, and custom jobs that need clear guidance, sharp output, and dependable follow-through.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/70">
                <p>{siteConfig.address}</p>
                <a href={siteConfig.phoneHref} className="mt-2 block font-bold text-white transition hover:text-brand">
                  Tel: {siteConfig.phone}
                </a>
                <p>Fax: {siteConfig.fax}</p>
                <a href={`mailto:${siteConfig.email}`} className="block transition hover:text-brand">
                  {siteConfig.email}
                </a>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/70">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Store hours</p>
                <div className="mt-2 space-y-1.5">
                  {siteConfig.hours.map((hour) => (
                    <p key={hour}>{hour}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm leading-7 text-white/70">
              <p className="max-w-lg">
                From quick document jobs to custom marketing materials, PrintMe keeps the process calm, practical, and local from quote to pickup.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/quote-request">Get My Quote</Button>
              <Button href={siteConfig.phoneHref} variant="secondary" className="bg-white/8 text-white ring-white/10 hover:bg-white/14 hover:text-white">
                Call PrintMe
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Quick links</p>
            <div className="mt-4 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="link-underline w-fit text-sm font-medium text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Print services</p>
            <div className="mt-4 flex flex-col gap-3">
              {serviceOptions.slice(0, 8).map((service) => (
                <p key={service} className="text-sm text-white/70">
                  {service}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Local support</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p>{siteConfig.experience} helping customers avoid print guesswork with clearer files, timing, and production guidance.</p>
              <p>Pickup available at {siteConfig.shortAddress}. Ask about delivery for qualifying orders.</p>
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 text-sm text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <p className="font-semibold text-white">Professional print help without the production guesswork.</p>
              <p className="mt-2">One local stop for document printing, marketing materials, stationery, technical prints, and custom orders.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Popular local print searches</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {localLandingPages.map((page) => (
              <Link key={page.slug} href={`/local/${page.slug}`} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-brand/45 hover:text-white">
                {page.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms of Service</Link>
            <p>{siteConfig.domain}</p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
