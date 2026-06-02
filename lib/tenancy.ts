import { PlatformTenant, ResolvedTenantContext } from "@/types";

const defaultTenant: PlatformTenant = {
  slug: "printme",
  name: "PrintMe Design",
  kind: "core",
  status: "active",
  publicAccess: "public",
  domains: ["localhost", "printmedesign.com"],
  site: {
    name: "PrintMe Design",
    brandName: "PrintMe",
    tagline: "Scarborough print and design support with clear quotes and dependable local follow-through.",
    domain: "printmedesign.com",
    phone: "416-572-1999",
    phoneHref: "tel:+14165721999",
    email: "printmetoronto@gmail.com",
    address: "1585 Markham Road Unit 103, Scarborough, ON M1B 2W1",
    shortAddress: "1585 Markham Road, Scarborough",
    cityRegion: "Scarborough & Toronto",
    serviceArea: "Scarborough, Toronto & GTA",
    description:
      "A Scarborough print shop for business printing, document printing, passport photos, banners, cheques, technical prints, and custom jobs with practical guidance from quote to pickup.",
    experience: "20+ Years of Experience",
    hours: [
      "Mon - Fri: 9:00 AM - 6:00 PM",
      "Sat: 10:00 AM - 4:00 PM",
      "Sun: By appointment",
    ],
    logoSrc: "/printme-logo.svg",
    logoAlt: "PrintMe Design",
  },
  theme: {
    key: "core",
    accentLabel: "Brand",
    heroStyle: "core",
  },
  navigation: [
    { label: "Products", href: "/products" },
    { label: "Services", href: "/services" },
    { label: "Quote Request", href: "/quote-request" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
  ],
  locationProfiles: [
    {
      id: "scarborough",
      slug: "scarborough",
      name: "Scarborough Shop",
      city: "Scarborough",
      region: "ON",
      supportsPickup: true,
      supportsDelivery: true,
      serviceArea: "Scarborough, Toronto & GTA",
    },
  ],
  capabilities: ["retail_storefront"],
  catalogPolicy: {
    mode: "global_with_overrides",
    allowedProductSlugs: [],
  },
  governance: {
    templateControl: "open",
    pricingControl: "central",
    localAdminMode: "none",
  },
};

export function getDefaultSiteContext(): ResolvedTenantContext {
  return {
    tenant: defaultTenant,
    activeLocation: defaultTenant.locationProfiles[0],
    navigation: defaultTenant.navigation,
  };
}

export function resolveTenantContext(params?: {
  host?: string;
  pathname?: string;
}): ResolvedTenantContext {
  void params;
  return getDefaultSiteContext();
}
