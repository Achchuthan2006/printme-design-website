import { FaqItem, ServiceItem, TestimonialItem, WhyChooseItem } from "@/types";

export const siteConfig = {
  name: "PrintMe Design",
  brandName: "PrintMe",
  tagline: "Make Your Styles With Us",
  domain: "printmedesign.com",
  phone: "416-572-1999",
  phoneHref: "tel:+14165721999",
  fax: "905-239-3334",
  email: "printmetoronto@gmail.com",
  address: "1585 Markham Road Unit 103, Scarborough, ON M1B 2W1",
  shortAddress: "1585 Markham Road, Scarborough",
  cityRegion: "Scarborough & Toronto",
  serviceArea: "Scarborough, Toronto & GTA",
  experience: "20+ Years of Experience",
  hours: [
    "Mon - Fri: 9:00 AM - 6:00 PM",
    "Sat: 10:00 AM - 4:00 PM",
    "Sun: By appointment",
  ],
  description:
    "A Scarborough one-stop print partner for sharp print work, practical guidance, fast turnarounds, and customer-first service from quote to pickup.",
};

export const navigation = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export const serviceOptions = [
  "Business Cards",
  "Document Printing",
  "Flyers",
  "Brochures",
  "Posters",
  "Banners",
  "Envelopes",
  "Signs",
  "Stickers",
  "Passport Photos",
  "Engineering Drawing Prints",
  "Manual Cheques",
  "Custom Orders",
];

export const services: ServiceItem[] = [
  {
    slug: "business-cards",
    title: "Business Cards",
    description: "Confident first impressions with crisp cards, clean finishes, and local print support.",
    icon: "card",
    badge: "Popular",
  },
  {
    slug: "document-printing",
    title: "Document Printing",
    description: "Clean reports, forms, manuals, and everyday documents printed without the guesswork.",
    icon: "document",
    badge: "In store",
  },
  {
    slug: "flyers",
    title: "Flyers",
    description: "Turn promotions, menus, and local campaigns into handouts people actually keep.",
    icon: "flyer",
    badge: "Rush available",
  },
  {
    slug: "brochures",
    title: "Brochures",
    description: "Organized folded pieces that explain your offer clearly and make your business easier to trust.",
    icon: "brochure",
  },
  {
    slug: "posters",
    title: "Posters",
    description: "High-visibility posters for announcements, storefronts, launches, and event promotion.",
    icon: "poster",
  },
  {
    slug: "banners",
    title: "Banners",
    description: "Durable banners that help your offer get noticed at openings, booths, sales, and events.",
    icon: "banner",
    badge: "Large format",
  },
  {
    slug: "envelopes",
    title: "Envelopes",
    description: "Branded envelopes that make invoices, mailouts, and business stationery feel complete.",
    icon: "envelope",
  },
  {
    slug: "signs",
    title: "Signs",
    description: "Clear signage for retail, office, event, and wayfinding needs with material guidance.",
    icon: "sign",
  },
  {
    slug: "stickers",
    title: "Stickers",
    description: "Custom stickers and labels that add polish to packaging, products, and promotions.",
    icon: "sticker",
  },
  {
    slug: "passport-photos",
    title: "Passport Photos",
    description: "Quick in-store passport and ID photos with a simple local service experience.",
    icon: "passport",
    badge: "Same day",
  },
  {
    slug: "engineering-drawings",
    title: "Engineering Drawing Prints",
    description: "Large-format plans and technical drawings printed clearly for contractors and project teams.",
    icon: "ruler",
    badge: "Large format",
  },
  {
    slug: "manual-cheques",
    title: "Manual Cheques",
    description: "Careful cheque printing support for businesses that need accurate stationery and setup review.",
    icon: "cheque",
  },
  {
    slug: "custom-orders",
    title: "Custom Orders",
    description: "Not sure what category fits? Bring the idea and we will help shape the right print path.",
    icon: "custom",
    badge: "Custom",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "What printing services do you offer?",
    answer:
      "We handle document printing, passport photos, flyers, envelopes, banners, engineering drawing prints, manual cheques, business cards, brochures, posters, signs, stickers, and custom jobs.",
  },
  {
    question: "Do you offer same-day or rush printing?",
    answer:
      "Yes. Many jobs can be prioritized based on file readiness, quantity, and finishing requirements. Send us your project details and deadline and we will confirm what is possible.",
  },
  {
    question: "Can I place a custom order?",
    answer:
      "Absolutely. If your project does not fit a standard product, request a quote and include dimensions, material preferences, quantity, and any finishing details.",
  },
  {
    question: "Do you offer design help?",
    answer:
      "Yes. We can help clean up supplied artwork or create print-ready layouts for business cards, flyers, brochures, signage, and other custom pieces.",
  },
  {
    question: "Do you offer pickup and delivery?",
    answer:
      "We offer in-store pickup and can discuss local delivery options for qualifying orders in Scarborough and the Toronto area.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "Use the quote request page, tell us what you need, and include quantity, deadline, artwork status, and pickup or delivery preference. We will review the details and follow up with the clearest next step.",
  },
  {
    question: "Can I send my files online?",
    answer:
      "Yes. You can attach artwork through the quote request, checkout, product upload prompts, or your account files area. We review files before production begins.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve customers across Scarborough, Toronto, and the GTA, with local pickup and support for nearby businesses, schools, community groups, and events.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    name: "Aisha K.",
    company: "Scarborough Wellness Clinic",
    quote:
      "We needed brochures and reception signage before a Monday opening. The files were checked, the timing was clear, and everything looked polished.",
  },
  {
    name: "Marco T.",
    company: "Toronto Food Startup",
    quote:
      "PrintMe Design helped us with labels, posters, and rush flyers for a launch weekend. The process was straightforward from quote to pickup.",
  },
  {
    name: "Priya S.",
    company: "Local Realtor",
    quote:
      "The business cards and open house materials felt premium and on brand. Having a local shop we can call makes repeat orders much easier.",
  },
];

export const whyChooseUs: WhyChooseItem[] = [
  {
    title: "High-Quality Printing",
    description: "Print work that looks clean, feels professional, and is checked before it reaches your customer.",
    icon: "check",
  },
  {
    title: "Custom Solutions",
    description: "If the job is not standard, we help clarify size, stock, finish, artwork, and production options.",
    icon: "custom",
  },
  {
    title: "Fast Turnaround",
    description: "Rush-friendly review for ready artwork, with honest timing before you commit.",
    icon: "clock",
  },
  {
    title: "Attention to Detail",
    description: "Files, finishes, quantities, and instructions are reviewed so avoidable issues are caught early.",
    icon: "inspect",
  },
  {
    title: "Innovative Techniques",
    description: "Modern print methods backed by practical production judgment from 20+ years in the industry.",
    icon: "spark",
  },
  {
    title: "Personalized Service",
    description: "Talk to a local team that understands your deadline, budget, file concerns, and final goal.",
    icon: "store",
  },
];

export const processSteps = [
  {
    title: "Send the Details",
    description: "Choose the service, share quantity and timing, and upload artwork if you have it.",
  },
  {
    title: "Approve the Plan",
    description: "We review the files and specs, then confirm pricing, timing, and production details.",
  },
  {
    title: "Get It Printed",
    description: "Your order moves into production, then you pick up in Scarborough or discuss local delivery.",
  },
];
