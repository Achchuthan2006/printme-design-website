"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { servicePages } from "@/data/services";
import { getCatalogNavigationFamilies } from "@/data/catalog";
import { ResolvedTenantContext } from "@/types";

export function Footer({ siteContext }: { siteContext: ResolvedTenantContext }) {
  const { tenant, navigation, activeLocation } = siteContext;
  const site = tenant.site;
  const isPrivatePortal = tenant.publicAccess === "private";
  const catalogFamilies = getCatalogNavigationFamilies().slice(0, 6);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.16),transparent_28rem),linear-gradient(180deg,#171311_0%,#0f0d0c_100%)] pb-20 text-white md:pb-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/55 to-transparent" aria-hidden="true" />
      <div className="container-shell py-16">
        <div className="liquid-glass-dark rounded-[2.15rem] p-6 sm:p-8">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.15fr_0.78fr_0.9fr_0.95fr_1fr]">
            <div className="space-y-5">
              <div>
                <BrandLogo
                  inverted
                  size="footer"
                  ariaLabel={site.name}
                  src={site.logoSrc}
                  alt={site.logoAlt ?? site.brandName}
                />
                <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
                  {isPrivatePortal
                    ? `${tenant.name} runs on PrintMe infrastructure with tenant-specific branding, controls, and approval flow.`
                    : "PrintMe helps businesses, schools, community groups, and walk-in customers order print with clearer quote rules, practical file review, and dependable local follow-through."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <p>{activeLocation ? `${activeLocation.name} / ${activeLocation.city}, ${activeLocation.region}` : site.address}</p>
                  <a href={site.phoneHref} className="mt-2 block font-bold text-white transition hover:text-brand">
                    Tel: {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="block transition hover:text-brand">
                    {site.email}
                  </a>
                  {activeLocation?.serviceArea ? <p>{activeLocation.serviceArea}</p> : null}
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Store hours</p>
                  <div className="mt-2 space-y-1.5">
                    {(site.hours ?? []).map((hour) => (
                      <p key={hour}>{hour}</p>
                    ))}
                    {!site.hours?.length ? <p>Portal access depends on tenant workflow and support coverage.</p> : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/quote-request">Request a Quote</Button>
                <Button href={site.phoneHref} variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                  {isPrivatePortal ? "Contact Portal Support" : "Call PrintMe"}
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Shop products</p>
              <div className="mt-4 flex flex-col gap-3">
                {catalogFamilies.map((family) => (
                  <Link key={family.slug} href={`/products/category/${family.slug}`} className="link-underline w-fit text-sm text-white/70 transition hover:text-white">
                    {family.title}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Quote-first services</p>
              <div className="mt-4 flex flex-col gap-3">
                {servicePages.slice(0, 6).map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} className="link-underline w-fit text-sm text-white/70 transition hover:text-white">
                    {service.shortTitle}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Pickup and support</p>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <p>{site.experience ?? "Local print ordering"} with clearer files, timing, and production guidance.</p>
                <p>{isPrivatePortal ? "Use this account area to manage approved products, files, and repeat ordering with the controls tied to your organization." : `Pickup available at ${site.shortAddress}. Ask about delivery for qualifying ${site.cityRegion} orders.`}</p>
              </div>
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.07] p-4 text-sm text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_34px_rgba(0,0,0,0.12)]">
                <p className="font-semibold text-white">{isPrivatePortal ? "Ordering, approvals, and repeat jobs in one place." : "Local print ordering with clearer next steps."}</p>
                <p className="mt-2">{isPrivatePortal ? "Keep approved products, uploads, proofs, and repeat orders organized without sending customers through disconnected tools." : "Order standard products online, request quotes for custom work, and keep artwork, pickup, and production details tied to the same workflow."}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="transition hover:text-white">Terms of Service</Link>
              <p>{site.domain}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
