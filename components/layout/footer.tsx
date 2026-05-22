import Link from "next/link";
import { navigation, serviceOptions, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink pb-20 text-white md:pb-0">
      <div className="container-shell py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.3fr_0.7fr_0.8fr_1fr]">
          <div className="space-y-5">
            <div>
              <BrandLogo inverted />
              <p className="mt-3 max-w-md text-sm leading-7 text-white/70">{siteConfig.description}</p>
            </div>
            <div className="text-sm leading-7 text-white/70">
              <p>{siteConfig.address}</p>
              <a href={siteConfig.phoneHref} className="block font-bold text-white transition hover:text-brand">
                Tel: {siteConfig.phone}
              </a>
              <p>Fax: {siteConfig.fax}</p>
              <a href={`mailto:${siteConfig.email}`} className="block transition hover:text-brand">
                {siteConfig.email}
              </a>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/quote-request">Request a Quote</Button>
              <Button href={siteConfig.phoneHref} variant="secondary">
                Call Now
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Quick links</p>
            <div className="mt-4 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium text-white/70 transition hover:translate-x-1 hover:text-white">
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
              <p>{siteConfig.experience} serving print customers with quality, speed, and personalized service.</p>
              <p>Pickup available at {siteConfig.shortAddress}. Delivery can be discussed for qualifying orders.</p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <p className="font-semibold text-white">{siteConfig.tagline}</p>
              <p className="mt-2">One stop for document printing, marketing materials, stationery, technical prints, and custom orders.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <p className="transition hover:text-white">Privacy Policy</p>
            <p className="transition hover:text-white">Terms of Service</p>
            <p>{siteConfig.domain}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
