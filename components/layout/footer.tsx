"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { servicePages } from "@/data/services";
import { catalogUtilityLinks, getCatalogNavigationFamilies } from "@/data/catalog";
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
          <div className="mb-8 grid gap-4 xl:grid-cols-2">
            {[
              isPrivatePortal ? "Portal-safe ordering, governed templates, and centralized workflow control" : "Business printing, document printing, banners, passport photos, and custom jobs",
              isPrivatePortal ? "Built from one shared PrintMe platform with tenant-level branding and controls" : "Pickup confidence from a real Scarborough print shop",
            ].map((item) => (
              <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {item}
              </div>
            ))}
          </div>
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
                    ? `${tenant.name} is powered by PrintMe core infrastructure, with tenant-specific branding, product controls, and operational governance layered on top.`
                    : "PrintMe Design helps businesses, schools, community groups, and walk-in customers order print with clearer quotes, practical file review, and dependable local follow-through."}
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Catalog families</p>
              <div className="mt-4 flex flex-col gap-3">
                {catalogFamilies.map((family) => (
                  <Link key={family.slug} href={`/products/category/${family.slug}`} className="link-underline w-fit text-sm text-white/70 transition hover:text-white">
                    {family.title}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Popular services</p>
              <div className="mt-4 flex flex-col gap-3">
                {servicePages.slice(0, 6).map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} className="link-underline w-fit text-sm text-white/70 transition hover:text-white">
                    {service.shortTitle}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Local support</p>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <p>{site.experience ?? "Centralized print operations"} helping customers avoid print guesswork with clearer files, timing, and production guidance.</p>
                <p>{isPrivatePortal ? "This portal can be governed by tenant, location, franchise, or reseller rules while still running on the same shared platform core." : `Pickup available at ${site.shortAddress}. Ask about delivery for qualifying ${site.cityRegion} orders.`}</p>
              </div>
              {!isPrivatePortal ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {catalogUtilityLinks.slice(0, 3).map((item) => (
                    <Link key={item.title} href={item.href} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/78 transition hover:bg-white/[0.1] hover:text-white">
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.07] p-4 text-sm text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_34px_rgba(0,0,0,0.12)]">
                <p className="font-semibold text-white">{isPrivatePortal ? "Managed print ordering without brand drift." : "Professional print help without the production guesswork."}</p>
                <p className="mt-2">{isPrivatePortal ? "Central teams control templates, catalogs, and governance while local or client users still get a clean ordering experience." : "One local stop for document printing, marketing materials, stationery, technical prints, passport photos, and custom orders."}</p>
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
