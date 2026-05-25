import { siteConfig } from "@/lib/site";

export const analyticsEvents = {
  heroQuoteClick: "hero_quote_click",
  heroServicesClick: "hero_services_click",
  phoneClick: "phone_click",
  quoteFormStart: "quote_form_start",
  quoteSubmit: "quote_submit",
  uploadStart: "upload_start",
  checkoutStart: "checkout_start",
  landingQuoteClick: "landing_quote_click",
  landingPhoneClick: "landing_phone_click",
};

export const homeHeroVariants = {
  default: {
    eyebrow: "Scarborough print shop for business printing, documents, signs, and custom jobs",
    headline: "Print faster, quote clearer, and pick up locally in Scarborough.",
    subheadline:
      "PrintMe Design helps Scarborough and Toronto businesses, schools, community groups, and walk-in customers order business cards, flyers, brochures, postcards, banners, signs, documents, passport photos, and custom print work with practical local guidance before production.",
    primaryCta: "Request a Quote",
    secondaryCta: "Browse Services",
    trustItems: ["Scarborough pickup and local support", "Artwork reviewed before production", "Rush-aware turnaround guidance"],
  },
  speed: {
    eyebrow: "Rush-friendly local printing",
    headline: "Need it printed fast without guessing the details?",
    subheadline:
      "Send your file, deadline, and quantity. PrintMe will review the job and help confirm the fastest realistic path to pickup or delivery.",
    primaryCta: "Get a Fast Quote",
    secondaryCta: "Browse Rush Services",
    trustItems: ["Ready artwork reviewed first", "Pickup at Markham Road", "Local Toronto-area support"],
  },
};

export const localTrustItems = [
  { icon: "store", title: "Visit or pick up in Scarborough", detail: `${siteConfig.shortAddress} for pickup, walk-ins, and local print support.` },
  { icon: "check", title: "Reviewed before production", detail: "Artwork, specs, and print-fit are checked before the job moves forward." },
  { icon: "clock", title: "Clear turnaround guidance", detail: "We confirm what is realistic for standard, rush, or same-day requests." },
];

export const quoteReassurance = [
  "No payment is taken on quote requests.",
  "Upload artwork now or send it after PrintMe replies.",
  "We review timing, file setup, pickup, delivery, and production fit.",
];

export interface LocalLandingPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  location: string;
  serviceFocus: string;
  headline: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  services: string[];
  proofPoints: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const localLandingPages: LocalLandingPage[] = [
  {
    slug: "printing-services-scarborough",
    title: "Printing Services in Scarborough",
    metaTitle: "Printing Services in Scarborough",
    metaDescription: "Local Scarborough printing services for business cards, flyers, banners, documents, passport photos, technical prints, and custom jobs.",
    location: "Scarborough",
    serviceFocus: "Printing services",
    headline: "Local printing in Scarborough with clear quotes and practical file support.",
    intro:
      "PrintMe helps local customers get business essentials, marketing materials, documents, photos, and custom print jobs produced with fewer unknowns.",
    primaryCta: "Get My Scarborough Quote",
    secondaryCta: "Call PrintMe",
    services: ["Business Cards", "Flyers", "Document Printing", "Passport Photos", "Banners", "Custom Orders"],
    proofPoints: ["20+ years of print experience", "Pickup on Markham Road", "Artwork reviewed before production"],
    faqs: [
      { question: "Can I request a quote online?", answer: "Yes. Send the service, quantity, deadline, and artwork if available. PrintMe will review the details and reply with the next step." },
      { question: "Do you serve customers outside Scarborough?", answer: "Yes. PrintMe supports Scarborough, Toronto, and nearby GTA customers with pickup and delivery discussion for qualifying orders." },
    ],
  },
  {
    slug: "same-day-printing-scarborough",
    title: "Same-Day Printing in Scarborough",
    metaTitle: "Same-Day Printing in Scarborough",
    metaDescription: "Rush and same-day printing review in Scarborough for ready artwork, documents, flyers, posters, and business print jobs.",
    location: "Scarborough",
    serviceFocus: "Same-day printing",
    headline: "Rush print job? Send the file and deadline first.",
    intro:
      "Same-day availability depends on file readiness, quantity, stock, finishing, and shop capacity. PrintMe helps confirm what is possible before you commit.",
    primaryCta: "Check Rush Availability",
    secondaryCta: "Call the Shop",
    services: ["Document Printing", "Flyers", "Posters", "Business Cards", "Passport Photos"],
    proofPoints: ["Rush-aware review", "Ready artwork prioritized", "Clear pickup guidance"],
    faqs: [
      { question: "Is same-day printing guaranteed?", answer: "No. Timing depends on product, file readiness, quantity, and finishing. Send details early so PrintMe can confirm what is realistic." },
      { question: "What helps rush jobs move faster?", answer: "A print-ready PDF, exact quantity, final size, pickup preference, and deadline help us review quickly." },
    ],
  },
  {
    slug: "business-card-printing-scarborough",
    title: "Business Card Printing in Scarborough",
    metaTitle: "Business Card Printing in Scarborough",
    metaDescription: "Business card printing in Scarborough with file review, stock guidance, pickup, and direct order or quote support.",
    location: "Scarborough",
    serviceFocus: "Business cards",
    headline: "Business cards that make the first handoff feel professional.",
    intro:
      "Choose common card options online or request help with stock, finish, double-sided layouts, and artwork cleanup before printing.",
    primaryCta: "Start Business Cards",
    secondaryCta: "Get a Quote First",
    services: ["Business Cards", "Envelopes", "Flyers", "Brochures"],
    proofPoints: ["Direct order available", "Double-sided options", "Pickup at PrintMe"],
    faqs: [
      { question: "Can PrintMe check my business card file?", answer: "Yes. Upload artwork or request a quote and PrintMe can review sizing, bleed, and production details." },
      { question: "Can I order specialty finishes?", answer: "Specialty stock and finishing should go through quote review so the details can be confirmed." },
    ],
  },
  {
    slug: "banner-printing-toronto",
    title: "Banner Printing in Toronto",
    metaTitle: "Banner Printing in Toronto",
    metaDescription: "Banner printing support for Toronto and Scarborough businesses, events, openings, booths, and promotions.",
    location: "Toronto",
    serviceFocus: "Banner printing",
    headline: "Banners for openings, events, storefronts, and local promotions.",
    intro:
      "PrintMe reviews size, material, finishing, artwork, timing, and pickup or delivery needs before production so your banner is built for the right use.",
    primaryCta: "Get a Banner Quote",
    secondaryCta: "Talk to PrintMe",
    services: ["Banners", "Signs", "Posters", "Custom Orders"],
    proofPoints: ["Large-format guidance", "Indoor and outdoor options", "Delivery discussion for larger orders"],
    faqs: [
      { question: "What banner details should I send?", answer: "Include size, indoor or outdoor use, quantity, deadline, finishing needs, and artwork if available." },
      { question: "Can you help with banner artwork?", answer: "Yes. Request a quote and explain what the banner needs to say, where it will be used, and when it is needed." },
    ],
  },
  {
    slug: "passport-photos-scarborough",
    title: "Passport Photos in Scarborough",
    metaTitle: "Passport Photos in Scarborough",
    metaDescription: "Quick in-store passport and ID photo support at PrintMe in Scarborough. Call ahead for timing and requirements.",
    location: "Scarborough",
    serviceFocus: "Passport photos",
    headline: "Need passport or ID photos nearby? Visit PrintMe in Scarborough.",
    intro:
      "PrintMe provides a simple in-store path for passport and ID photo needs. Call ahead when timing or document requirements matter.",
    primaryCta: "Call Before Visiting",
    secondaryCta: "Plan My Visit",
    services: ["Passport Photos", "Document Printing", "Custom Orders"],
    proofPoints: ["In-store service", "Local Scarborough shop", "Quick support when available"],
    faqs: [
      { question: "Do I need an appointment?", answer: "Call PrintMe to confirm current availability and any special requirements before visiting." },
      { question: "Where is PrintMe located?", answer: `PrintMe is located at ${siteConfig.address}.` },
    ],
  },
  {
    slug: "flyer-printing-toronto",
    title: "Flyer Printing in Toronto",
    metaTitle: "Flyer Printing in Toronto",
    metaDescription: "Flyer printing for Toronto and Scarborough promotions, menus, events, real estate, retail offers, and local campaigns.",
    location: "Toronto",
    serviceFocus: "Flyer printing",
    headline: "Flyers that make your offer easy to notice and act on.",
    intro:
      "From menus and door drops to event handouts and real estate promos, PrintMe helps confirm size, quantity, sides, turnaround, and artwork readiness.",
    primaryCta: "Get a Flyer Quote",
    secondaryCta: "Upload Artwork",
    services: ["Flyers", "Brochures", "Posters", "Business Cards"],
    proofPoints: ["Rush review available", "Common sizes supported", "Design help available"],
    faqs: [
      { question: "Can flyers be printed quickly?", answer: "Often, yes. Send artwork, quantity, size, and deadline so PrintMe can confirm timing." },
      { question: "Can PrintMe help design the flyer?", answer: "Yes. Include your copy, logo, preferred size, and deadline in the quote request." },
    ],
  },
];

export function getLocalLandingPage(slug: string) {
  return localLandingPages.find((page) => page.slug === slug);
}
