export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  name: string;
  company: string;
  quote: string;
}

export interface QuoteRequestPayload {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceNeeded: string;
  quantity: string;
  preferredDeadline: string;
  fulfillmentMethod: string;
  projectDetails: string;
}

export type ProductMode = "direct-order" | "quote-only" | "hybrid";
export type ProductCtaMode = "direct-order" | "quote-first" | "upload-first" | "contact";

export interface ProductCategory {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  metaDescription: string;
  icon: string;
  highlight: string;
  turnaroundNote: string;
  trustNotes: string[];
}

export interface ProductOptionChoice {
  label: string;
  value: string;
  priceDelta?: number;
  description?: string;
}

export interface ProductOption {
  name: string;
  label: string;
  type: "select" | "radio" | "textarea";
  group?: "quantity" | "size" | "material" | "finish" | "print" | "turnaround" | "fulfillment" | "artwork" | "notes";
  helperText?: string;
  defaultValue?: string;
  choices?: ProductOptionChoice[];
  required?: boolean;
}

export interface PrintProduct {
  slug: string;
  title: string;
  shortTitle?: string;
  categorySlug: string;
  category: string;
  description: string;
  longDescription: string;
  overview: string;
  idealFor: string[];
  icon: string;
  mode: ProductMode;
  ctaMode: ProductCtaMode;
  startingPrice?: number;
  turnaround: string;
  rushNote?: string;
  pickupDeliveryNote: string;
  badges?: string[];
  specs: string[];
  fileRequirements: string[];
  options: ProductOption[];
  faqs: FaqItem[];
  related: string[];
}

export interface CartItem {
  id: string;
  productSlug: string;
  title: string;
  quantity: number;
  unitPrice: number;
  estimatedTotal: number;
  pricingMode: "fixed-estimate" | "starting-from" | "quote-only";
  mode: ProductMode;
  options: Record<string, string>;
  optionLabels: Array<{ label: string; value: string }>;
  notes?: string;
  fulfillmentMethod?: string;
  turnaround?: string;
  quoteOnly?: boolean;
}

export interface AccountWidget {
  title: string;
  value: string;
  description: string;
}

export interface CheckoutCustomer {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
}

export interface CheckoutAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  fulfillmentMethod: "pickup" | "delivery";
  deliveryAddress?: CheckoutAddress;
  orderNotes?: string;
  paymentMode: "full" | "deposit";
  items: CartItem[];
  subtotal: number;
}

export interface OrderSnapshot {
  orderNumber: string;
  customer: CheckoutCustomer;
  fulfillmentMethod: "pickup" | "delivery";
  deliveryAddress?: CheckoutAddress;
  orderNotes?: string;
  items: CartItem[];
  subtotalCents: number;
  payableCents: number;
  quoteReviewRequired: boolean;
  paymentStatus: "pending" | "paid" | "demo" | "failed";
  createdAt: string;
}
