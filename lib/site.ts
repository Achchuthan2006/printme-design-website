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
    "A Scarborough one-stop print partner with 20+ years of industry experience, custom solutions, fast turnaround, and attentive local service.",
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
    description: "Professional cards with crisp detail, clean finishes, and a strong first impression.",
    icon: "card",
    badge: "Popular",
  },
  {
    slug: "document-printing",
    title: "Document Printing",
    description: "Reliable black-and-white and colour documents for reports, forms, manuals, and daily work.",
    icon: "document",
    badge: "In store",
  },
  {
    slug: "flyers",
    title: "Flyers",
    description: "Sharp promotional flyers for menus, events, local campaigns, and business offers.",
    icon: "flyer",
    badge: "Rush available",
  },
  {
    slug: "brochures",
    title: "Brochures",
    description: "Folded marketing pieces for services, product details, pricing, and brand stories.",
    icon: "brochure",
  },
  {
    slug: "posters",
    title: "Posters",
    description: "Bold poster prints for storefronts, schools, promotions, launches, and announcements.",
    icon: "poster",
  },
  {
    slug: "banners",
    title: "Banners",
    description: "Durable banners for openings, booths, sales, events, and outdoor visibility.",
    icon: "banner",
    badge: "Large format",
  },
  {
    slug: "envelopes",
    title: "Envelopes",
    description: "Custom printed envelopes for business stationery, invoices, mailouts, and branded packages.",
    icon: "envelope",
  },
  {
    slug: "signs",
    title: "Signs",
    description: "Retail, office, event, and directional signage with clear material guidance.",
    icon: "sign",
  },
  {
    slug: "stickers",
    title: "Stickers",
    description: "Custom labels and stickers for packaging, product runs, branding, and promotions.",
    icon: "sticker",
  },
  {
    slug: "passport-photos",
    title: "Passport Photos",
    description: "Quick in-store passport and ID photo service with a simple, efficient process.",
    icon: "passport",
    badge: "Same day",
  },
  {
    slug: "engineering-drawings",
    title: "Engineering Drawing Prints",
    description: "Large-format plan and technical drawing prints for contractors, offices, and project teams.",
    icon: "ruler",
    badge: "Large format",
  },
  {
    slug: "manual-cheques",
    title: "Manual Cheques",
    description: "Manual cheque printing support for businesses that need accurate, professional stationery.",
    icon: "cheque",
  },
  {
    slug: "custom-orders",
    title: "Custom Orders",
    description: "Custom print and design support for packaging, stationery, marketing, and specialty jobs.",
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
      "Use the quote request page, tell us what you need, and include your quantity, deadline, and project details. We will follow up with pricing and next steps.",
  },
  {
    question: "Can I send my files online?",
    answer:
      "File upload will be added in a future release. For now, use the quote form and we can confirm the best way to send artwork after reviewing your request.",
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
    description: "Sharp colour, clean details, and careful production for business materials that feel ready to use.",
    icon: "check",
  },
  {
    title: "Custom Solutions",
    description: "From stationery to packaging and specialty jobs, we help shape the right print solution.",
    icon: "custom",
  },
  {
    title: "Fast Turnaround",
    description: "Rush-friendly service and practical timelines for projects that need to move quickly.",
    icon: "clock",
  },
  {
    title: "Attention to Detail",
    description: "We check files, finishes, quantities, and instructions so small details do not get missed.",
    icon: "inspect",
  },
  {
    title: "Innovative Techniques",
    description: "Modern print methods and practical production knowledge built from 20+ years of experience.",
    icon: "spark",
  },
  {
    title: "Personalized Service",
    description: "You can speak with a local team that understands your project, deadline, and expectations.",
    icon: "store",
  },
];

export const processSteps = [
  {
    title: "Send Your Request",
    description: "Tell us what you need, upload or share files, and include your deadline.",
  },
  {
    title: "We Print It",
    description: "We review, print, and check your order to make sure the results are clean.",
  },
  {
    title: "Pickup or Delivery",
    description: "Collect in-store or ask about local delivery for a smooth handoff.",
  },
];
