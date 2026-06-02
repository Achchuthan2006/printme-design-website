"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useAuth } from "@/components/account/auth-provider";
import { useCart } from "@/features/cart/cart-context";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { cn } from "@/lib/utils";
import { ResolvedTenantContext, CatalogSearchEntry, ProductCategory } from "@/types";
import {
  catalogUtilityLinks,
  featuredCatalogCollections,
  getCatalogCategoryBySlug,
  getCatalogNavigationFamilies,
  getCatalogSearchEntries,
  industryPaths,
} from "@/data/catalog";
import { servicePages } from "@/data/services";
import { Icon } from "@/components/ui/icon";
import { buildNoResultsRecovery, runCatalogSearch } from "@/lib/discovery";
import { NavItemLink, NavList } from "@/components/ui/navigation";

type DesktopPanel = "products" | "industries" | "services" | "help" | null;
type MobileSection = "root" | "products" | "industries" | "services" | "help" | "family";

const publicNavItems = [
  { id: "products" as const, label: "Products" },
  { id: "industries" as const, label: "Industries" },
  { id: "services" as const, label: "Services" },
  { id: "help" as const, label: "Help" },
];

function SearchResults({
  query,
  entries,
  onNavigate,
}: {
  query: string;
  entries: CatalogSearchEntry[];
  onNavigate: () => void;
}) {
  const normalizedQuery = query.trim();
  const search = runCatalogSearch(normalizedQuery, 8);
  const matches = normalizedQuery ? search.results : entries.slice(0, 6);
  const recovery = normalizedQuery ? search.recovery.slice(0, 2) : [];

  return (
    <div className="rounded-[1.55rem] border border-white/75 bg-white/95 p-3 shadow-[0_28px_70px_rgba(18,17,16,0.14)] backdrop-blur-[16px]">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">
          {normalizedQuery ? `Best matches (${matches.length})` : "Popular shortcuts"}
        </p>
        <Link href={normalizedQuery ? `/products?query=${encodeURIComponent(normalizedQuery)}` : "/products"} className="text-[10px] font-black uppercase tracking-[0.16em] text-brand" onClick={onNavigate}>
          View all results
        </Link>
      </div>
      <div className="grid gap-2">
        {matches.map((entry) => (
          <Link
            key={`${entry.type}-${entry.href}`}
            href={entry.href}
            onClick={onNavigate}
            className="rounded-[1.2rem] border border-line/70 bg-canvas/60 px-4 py-3 transition hover:border-brand/25 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-ink">{entry.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{entry.description}</p>
              </div>
              {entry.badge ? (
                <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">
                  {entry.badge}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
      {normalizedQuery && search.suggestions.length > 0 ? (
        <div className="mt-3 rounded-[1.2rem] border border-line/70 bg-canvas/70 px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate">Suggested searches</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {search.suggestions.map((suggestion) => (
              <Link
                key={suggestion}
                href={`/products?query=${encodeURIComponent(suggestion)}`}
                onClick={onNavigate}
                className="value-chip"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {matches.length === 0 ? (
        <div className="mt-3 grid gap-2">
          {recovery.map((item) => (
            <Link key={item.title} href={item.href} onClick={onNavigate} className="rounded-[1.2rem] border border-line/70 bg-canvas/70 px-4 py-4 text-sm leading-6 text-slate transition hover:border-brand/20 hover:bg-white">
              <p className="font-black text-ink">{item.title}</p>
              <p className="mt-1">{item.description}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategoryButton({
  category,
  active,
  onHover,
}: {
  category: ProductCategory;
  active: boolean;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onHover}
      className={cn(
        "w-full rounded-[1.35rem] border px-4 py-3 text-left transition",
        active ? "border-brand/20 bg-brand-soft/60 shadow-soft" : "border-transparent bg-white/70 hover:border-brand/15 hover:bg-white",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
          <Icon name={category.icon} className="h-4.5 w-4.5" />
        </span>
        <span>
          <span className="block text-sm font-black text-ink">{category.title}</span>
          <span className="mt-1 block text-xs leading-5 text-slate">{category.productCountLabel ?? category.shortTitle}</span>
        </span>
      </div>
    </button>
  );
}

export function Header({ siteContext }: { siteContext: ResolvedTenantContext }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [desktopPanel, setDesktopPanel] = useState<DesktopPanel>(null);
  const [activeFamilySlug, setActiveFamilySlug] = useState(getCatalogNavigationFamilies()[0]?.slug ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSection>("root");
  const [mobileFamilySlug, setMobileFamilySlug] = useState(getCatalogNavigationFamilies()[0]?.slug ?? "");
  const { itemCount } = useCart();
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const accountLabel = profile?.fullName ?? user?.email?.split("@")[0] ?? "Account";
  const { tenant, navigation } = siteContext;
  const site = tenant.site;
  const isPrivatePortal = tenant.publicAccess === "private";
  const catalogFamilies = useMemo(() => getCatalogNavigationFamilies(), []);
  const searchEntries = useMemo(() => getCatalogSearchEntries(), []);
  const activeFamily = getCatalogCategoryBySlug(activeFamilySlug) ?? catalogFamilies[0];
  const mobileFamily = getCatalogCategoryBySlug(mobileFamilySlug) ?? catalogFamilies[0];
  const serviceLinks = servicePages.slice(0, 10);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
    setDesktopPanel(null);
    setSearchOpen(false);
    setMobileSection("root");
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!accountOpen) return;
    const handleClick = () => setAccountOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [accountOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [searchOpen]);

  const handleDesktopPanel = (panel: DesktopPanel) => {
    setDesktopPanel(panel);
    setSearchOpen(false);
  };

  const renderPublicDesktopPanel = () => {
    if (!desktopPanel) return null;

    if (desktopPanel === "products" && activeFamily) {
      return (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.32fr_0.78fr]">
          <div className="rounded-[1.6rem] border border-line/70 bg-canvas/75 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Catalog families</p>
            <div className="mt-3 grid gap-2">
              {catalogFamilies.map((family) => (
                <CategoryButton
                  key={family.slug}
                  category={family}
                  active={family.slug === activeFamily.slug}
                  onHover={() => setActiveFamilySlug(family.slug)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-[1.6rem] border border-line/70 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">{activeFamily.shortTitle}</p>
                <h3 className="mt-2 text-[1.8rem] font-black leading-[1.02] text-ink">{activeFamily.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">{activeFamily.overview ?? activeFamily.description}</p>
              </div>
              <Button href={`/products/category/${activeFamily.slug}`} variant="secondary" size="sm">
                Open Category
              </Button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {activeFamily.subcategoryGroups?.map((group) => (
                <div key={group.title} className="rounded-[1.35rem] border border-line/70 bg-canvas/65 p-4">
                  <p className="text-sm font-black text-ink">{group.title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate">{group.description}</p>
                  <div className="mt-4 grid gap-2">
                    {group.items.map((item) => (
                      <Link key={item.title} href={item.href} className="rounded-[1rem] border border-transparent bg-white/75 px-3 py-3 transition hover:border-brand/15 hover:bg-white">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-ink">{item.title}</p>
                            <p className="mt-1 text-xs leading-5 text-slate">{item.description}</p>
                          </div>
                          {item.badge ? <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate">{item.badge}</span> : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-line/70 bg-canvas/75 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Featured in this family</p>
              <div className="mt-3 grid gap-2">
                {activeFamily.featuredLinks?.map((link) => (
                  <Link key={link.title} href={link.href} className="rounded-[1.15rem] border border-line/70 bg-white px-4 py-3 transition hover:border-brand/20">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.95rem] border border-brand/15 bg-brand-soft text-brand">
                        <Icon name={link.icon} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-ink">{link.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate">{link.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {activeFamily.merchandisingCollections?.length ? (
              <div className="rounded-[1.6rem] border border-line/70 bg-white p-4 shadow-soft">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Recommended collections</p>
                <div className="mt-3 grid gap-2">
                  {activeFamily.merchandisingCollections.map((item) => (
                    <Link key={item.title} href={item.href} className="rounded-[1.15rem] border border-line/70 bg-canvas/65 px-4 py-3 transition hover:border-brand/20 hover:bg-white">
                      <p className="text-sm font-black text-ink">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    if (desktopPanel === "industries") {
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {industryPaths.map((industry) => (
            <Link key={industry.slug} href={industry.href} className="rounded-[1.5rem] border border-line/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/20">
              <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
                <Icon name={industry.icon} className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-[1.18rem] font-black text-ink">{industry.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate">{industry.description}</p>
            </Link>
          ))}
        </div>
      );
    }

    if (desktopPanel === "services") {
      return (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {serviceLinks.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="rounded-[1.35rem] border border-line/70 bg-white p-4 shadow-soft transition hover:border-brand/20">
                <p className="text-sm font-black text-ink">{service.shortTitle}</p>
                <p className="mt-2 text-xs leading-5 text-slate">{service.summary}</p>
              </Link>
            ))}
          </div>
          <div className="rounded-[1.6rem] border border-line/70 bg-canvas/75 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate">Service-first entry points</p>
            <div className="mt-3 grid gap-2">
              {catalogUtilityLinks.slice(0, 4).map((link) => (
                <Link key={link.title} href={link.href} className="rounded-[1.15rem] border border-line/70 bg-white px-4 py-3 transition hover:border-brand/20">
                  <p className="text-sm font-black text-ink">{link.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr]">
        {catalogUtilityLinks.map((link) => (
          <Link key={link.title} href={link.href} className="rounded-[1.5rem] border border-line/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/20">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
              <Icon name={link.icon} className="h-4.5 w-4.5" />
            </span>
            <h3 className="mt-4 text-[1.12rem] font-black text-ink">{link.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate">{link.description}</p>
          </Link>
        ))}
      </div>
    );
  };

  const renderPrivateDesktopNav = (
    <NavList aria-label="Primary" layout="inline" className="hidden gap-8 lg:flex">
      {navigation.map((item) => (
        <NavItemLink
          key={item.href}
          href={item.href}
          tone="soft"
          active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
          className="relative rounded-full px-2 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100"
        >
          {item.label}
        </NavItemLink>
      ))}
    </NavList>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/55 bg-[rgba(255,252,248,0.78)] backdrop-blur-[18px] transition-all duration-300 supports-[backdrop-filter]:bg-[rgba(255,252,248,0.72)]",
        scrolled ? "shadow-[0_22px_56px_rgba(22,19,17,0.12)]" : "shadow-[0_10px_30px_rgba(22,19,17,0.06)]",
      )}
      onMouseLeave={() => setDesktopPanel(null)}
    >
      <div className="hidden border-b border-white/10 bg-[linear-gradient(180deg,#201c1a_0%,#171413_100%)] text-white lg:block">
        <div className="container-shell flex h-11 items-center justify-between gap-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/66">
          <div className="flex items-center gap-5">
            <span>{isPrivatePortal ? `${tenant.name} portal` : `${site.cityRegion} print platform`}</span>
            {site.experience ? <span>{site.experience}</span> : null}
            <span>{isPrivatePortal ? "Governed products, templates, and approvals" : "Large catalog, custom quotes, and local support"}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href={site.phoneHref} className="link-underline text-white">
              {site.phone}
            </a>
            <span>{site.shortAddress}</span>
          </div>
        </div>
      </div>
      <div className="container-shell">
        <div className={cn("flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-[76px]" : "h-[92px]")}>
          <div className="flex items-center gap-4">
            <BrandLogo
              className="mr-1 lg:mr-2"
              size="header"
              ariaLabel={site.name}
              src={site.logoSrc}
              alt={site.logoAlt ?? site.brandName}
            />
            {!isPrivatePortal ? (
              <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
                {publicNavItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => handleDesktopPanel(item.id)}
                    onFocus={() => handleDesktopPanel(item.id)}
                    onClick={() => setDesktopPanel((current) => (current === item.id ? null : item.id))}
                    className={cn(
                      "rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] transition",
                      desktopPanel === item.id ? "bg-brand-soft text-brand" : "text-ink hover:bg-white hover:text-brand",
                    )}
                    aria-expanded={desktopPanel === item.id}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : renderPrivateDesktopNav}
          </div>

          <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center">
            {!isPrivatePortal ? (
              <div className="relative w-full max-w-[440px]">
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen((current) => !current);
                    setDesktopPanel(null);
                  }}
                  className="premium-input flex w-full items-center justify-between gap-3 text-left"
                  aria-expanded={searchOpen}
                >
                  <span className="flex items-center gap-3 text-sm font-semibold text-slate">
                    <Icon name="inspect" className="h-4.5 w-4.5 text-brand" />
                    Search products, services, packaging, signage, apparel...
                  </span>
                  <span className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate">
                    Search
                  </span>
                </button>
                {searchOpen ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.9rem)] z-[70]">
                    <div className="rounded-[1.6rem] border border-white/75 bg-white/96 p-3 shadow-[0_28px_70px_rgba(18,17,16,0.14)] backdrop-blur-[16px]">
                      <div className="mb-3 flex items-center gap-3 rounded-[1.2rem] border border-line/70 bg-canvas/70 px-4 py-3">
                        <Icon name="inspect" className="h-4.5 w-4.5 text-brand" />
                        <input
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder="Search products, services, support shortcuts"
                          className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-slate/60"
                        />
                      </div>
                      <SearchResults query={searchQuery} entries={searchEntries} onNavigate={() => setSearchOpen(false)} />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5 lg:gap-3">
            <CartDrawer compact />
            <div className="hidden items-center gap-3 lg:flex">
              {!loading ? (
                user ? (
                  <div className="relative" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setAccountOpen((value) => !value)}
                      className="liquid-glass flex items-center gap-3 rounded-[1.35rem] px-4 py-2.5 text-left transition hover:border-brand/35"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ef6a46_0%,#d94620_75%,#b73314_100%)] text-xs font-black uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                        {accountLabel.slice(0, 1)}
                      </span>
                      <span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate">My account</span>
                        <span className="mt-0.5 block max-w-[9rem] truncate text-sm font-extrabold text-ink">{accountLabel}</span>
                      </span>
                    </button>
                    <div className={cn("absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[1.5rem] border border-white/75 bg-white/92 p-3 shadow-[0_24px_64px_rgba(18,17,16,0.14)] backdrop-blur-[16px] transition", accountOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0")}>
                      <div className="rounded-[1.15rem] border border-white/80 bg-white/84 px-3 py-3 text-xs leading-5 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <p className="font-black text-ink">{profile?.fullName ?? user.email}</p>
                        <p className="mt-1">{isPrivatePortal ? "Orders stay tied to your portal, location, and approval flow." : "Quotes, orders, uploads, reorders, and saved product paths all stay connected here."}</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <Link href="/account" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Open dashboard</Link>
                        <Link href="/account/orders" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Orders and quotes</Link>
                        <Link href="/account/files" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Files and uploads</Link>
                        {isAdmin ? <Link href="/admin" className="rounded-[1rem] px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand">Admin portal</Link> : null}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut();
                          setAccountOpen(false);
                        }}
                        className="mt-3 w-full rounded-[1rem] border border-white/80 bg-white/84 px-3 py-2.5 text-sm font-bold text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition hover:text-brand"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button href="/account/login" variant="secondary" size="sm">Sign In</Button>
                    <Button href="/account/create" size="sm">Create Account</Button>
                  </div>
                )
              ) : null}
              {!isPrivatePortal ? (
                <div className="liquid-glass flex h-[52px] min-w-[188px] items-center justify-center gap-3 rounded-[1.35rem] px-4 text-left">
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.16em] text-slate">Custom or urgent?</p>
                    <a href={site.phoneHref} className="block whitespace-nowrap text-sm font-extrabold text-ink transition hover:text-brand">
                      {site.phone}
                    </a>
                  </div>
                </div>
              ) : null}
              <Button href="/quote-request" size="sm">
                Request a Quote
                <span aria-hidden="true" className="ml-2">-&gt;</span>
              </Button>
            </div>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="printme-mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-[1.2rem] transition hover:border-brand/45 hover:bg-white lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className={cn("block h-0.5 w-5 bg-ink transition", open && "translate-y-2 rotate-45")} />
              <span className={cn("block h-0.5 w-5 bg-ink transition", open && "opacity-0")} />
              <span className={cn("block h-0.5 w-5 bg-ink transition", open && "-translate-y-2 -rotate-45")} />
            </div>
          </button>
        </div>

        {!isPrivatePortal && desktopPanel ? (
          <div className="relative hidden pb-5 lg:block">
            <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,245,239,0.95))] p-5 shadow-[0_30px_80px_rgba(18,17,16,0.16)] backdrop-blur-[16px]">
              {renderPublicDesktopPanel()}
            </div>
          </div>
        ) : null}

        <div
          id="printme-mobile-menu"
          className={cn(
            "grid border-t border-white/60 transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 py-4">
              {!isPrivatePortal ? (
                <>
                  <div className="rounded-[1.45rem] border border-line/70 bg-white/80 p-3">
                    <div className="flex items-center gap-3 rounded-[1.1rem] border border-line/70 bg-canvas/70 px-4 py-3">
                      <Icon name="inspect" className="h-4.5 w-4.5 text-brand" />
                      <input
                        value={searchQuery}
                        onChange={(event) => {
                          setSearchQuery(event.target.value);
                          setSearchOpen(true);
                        }}
                        placeholder="Search products, services, support"
                        className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-slate/60"
                      />
                    </div>
                    {searchOpen ? <div className="mt-3"><SearchResults query={searchQuery} entries={searchEntries} onNavigate={() => setOpen(false)} /></div> : null}
                  </div>

                  {mobileSection === "root" ? (
                    <div className="space-y-3">
                      {[
                        { id: "products" as const, label: "Browse Products", description: "Open the full large-catalog family system." },
                        { id: "industries" as const, label: "Browse by Industry", description: "Jump in by use case, business type, or campaign need." },
                        { id: "services" as const, label: "Services and Support", description: "Explore consultative service pages and guided paths." },
                        { id: "help" as const, label: "Quotes, Rush, and Help", description: "Use shortcuts for custom jobs, urgent timelines, and artwork help." },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMobileSection(item.id)}
                          className="w-full rounded-[1.45rem] border border-line/70 bg-white/85 px-4 py-4 text-left shadow-soft"
                        >
                          <p className="text-sm font-black text-ink">{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-slate">{item.description}</p>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {mobileSection === "products" ? (
                    <div className="space-y-3">
                      <button type="button" onClick={() => setMobileSection("root")} className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">
                        &lt; Back
                      </button>
                      {catalogFamilies.map((family) => (
                        <button
                          key={family.slug}
                          type="button"
                          onClick={() => {
                            setMobileFamilySlug(family.slug);
                            setMobileSection("family");
                          }}
                          className="w-full rounded-[1.45rem] border border-line/70 bg-white/85 px-4 py-4 text-left shadow-soft"
                        >
                          <p className="text-sm font-black text-ink">{family.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate">{family.description}</p>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {mobileSection === "family" && mobileFamily ? (
                    <div className="space-y-4">
                      <button type="button" onClick={() => setMobileSection("products")} className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">
                        &lt; Back to families
                      </button>
                      <div className="rounded-[1.45rem] border border-line/70 bg-white/85 p-4 shadow-soft">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">{mobileFamily.shortTitle}</p>
                        <h3 className="mt-2 text-xl font-black text-ink">{mobileFamily.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate">{mobileFamily.overview ?? mobileFamily.description}</p>
                        <div className="mt-4">
                          <Button href={`/products/category/${mobileFamily.slug}`} className="w-full justify-center" onClick={() => setOpen(false)}>
                            Open Category Hub
                          </Button>
                        </div>
                      </div>
                      {mobileFamily.subcategoryGroups?.map((group) => (
                        <div key={group.title} className="rounded-[1.45rem] border border-line/70 bg-white/85 p-4 shadow-soft">
                          <p className="text-sm font-black text-ink">{group.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate">{group.description}</p>
                          <div className="mt-3 grid gap-2">
                            {group.items.map((item) => (
                              <Link key={item.title} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.05rem] border border-line/70 bg-canvas/70 px-3 py-3">
                                <p className="text-sm font-black text-ink">{item.title}</p>
                                <p className="mt-1 text-xs leading-5 text-slate">{item.description}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {mobileSection === "industries" ? (
                    <div className="space-y-3">
                      <button type="button" onClick={() => setMobileSection("root")} className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">
                        &lt; Back
                      </button>
                      {industryPaths.map((industry) => (
                        <Link key={industry.slug} href={industry.href} onClick={() => setOpen(false)} className="rounded-[1.45rem] border border-line/70 bg-white/85 px-4 py-4 shadow-soft">
                          <p className="text-sm font-black text-ink">{industry.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate">{industry.description}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {mobileSection === "services" ? (
                    <div className="space-y-3">
                      <button type="button" onClick={() => setMobileSection("root")} className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">
                        &lt; Back
                      </button>
                      {serviceLinks.map((service) => (
                        <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setOpen(false)} className="rounded-[1.45rem] border border-line/70 bg-white/85 px-4 py-4 shadow-soft">
                          <p className="text-sm font-black text-ink">{service.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate">{service.summary}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {mobileSection === "help" ? (
                    <div className="space-y-3">
                      <button type="button" onClick={() => setMobileSection("root")} className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">
                        &lt; Back
                      </button>
                      {[...catalogUtilityLinks, ...featuredCatalogCollections].map((item) => (
                        <Link key={item.title} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.45rem] border border-line/70 bg-white/85 px-4 py-4 shadow-soft">
                          <p className="text-sm font-black text-ink">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate">{item.description}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <NavList aria-label="Mobile" className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <NavItemLink
                      key={item.href}
                      href={item.href}
                      tone="soft"
                      active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                      className="rounded-[1.25rem] px-4 py-3"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavItemLink>
                  ))}
                </NavList>
              )}

              <div className="grid gap-2">
                <Button href="/quote-request" className="w-full" onClick={() => setOpen(false)}>
                  Request a Quote
                </Button>
                {user ? (
                  <>
                    <Button href="/account" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                      My Account
                    </Button>
                    {isAdmin ? <Button href="/admin" variant="secondary" className="w-full" onClick={() => setOpen(false)}>Admin Portal</Button> : null}
                  </>
                ) : (
                  <>
                    <Button href="/account/login" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                      Sign In
                    </Button>
                    <Button href="/account/create" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                      Create Account
                    </Button>
                  </>
                )}
                <Button href="/cart" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                  Cart {itemCount > 0 ? `(${itemCount})` : ""}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
