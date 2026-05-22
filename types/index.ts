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

export interface CustomerProfile {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  accountStatus?: "active" | "pending" | "paused";
  communicationPreferences?: {
    emailUpdates: boolean;
    smsUpdates: boolean;
    marketingEmails: boolean;
  };
}

export interface AccountOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending_review" | "in_production" | "ready_for_pickup" | "completed" | "quote_required";
  total: string;
  fulfillmentMethod: string;
  items: string[];
}

export interface AccountQuote {
  id: string;
  service: string;
  requestedDate: string;
  status: "new" | "reviewing" | "priced" | "approved" | "expired";
  summary: string;
}

export interface AccountFile {
  id: string;
  fileName: string;
  relatedTo: string;
  uploadedAt: string;
  fileSize?: string;
  fileType?: string;
  status: ArtworkUploadStatus;
}

export interface AccountInvoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  amount: string;
  status: "paid" | "unpaid" | "void";
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

export type ArtworkUploadScope = "quote" | "order" | "account" | "product";

export type ArtworkUploadStatus =
  | "uploaded"
  | "awaiting_review"
  | "needs_changes"
  | "approved_for_print"
  | "proof_required"
  | "ready_for_production";

export interface ArtworkUploadContext {
  scope: ArtworkUploadScope;
  quoteId?: string;
  orderId?: string;
  customerId?: string;
  productSlug?: string;
  relatedLabel?: string;
}

export interface ArtworkUploadMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  bucket: string;
  path: string | null;
  uploadedAt: string;
  status: ArtworkUploadStatus;
  context: ArtworkUploadContext;
  skipped?: boolean;
}

export type AdminOrderStatus =
  | "new"
  | "awaiting_review"
  | "quoted"
  | "awaiting_payment"
  | "paid"
  | "in_production"
  | "ready_for_pickup"
  | "shipped_delivered"
  | "completed"
  | "on_hold";

export type AdminQuoteStatus =
  | "new_quote"
  | "reviewing"
  | "waiting_for_files"
  | "quoted"
  | "customer_responded"
  | "approved"
  | "converted_to_order"
  | "closed";

export type AdminPriority = "low" | "normal" | "high" | "urgent";

export interface AdminCustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  tags: string[];
  lastActivity: string;
  lifetimeValue: string;
  notes?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  items: string[];
  total: string;
  fulfillmentMethod: "Pickup" | "Delivery";
  paymentStatus: "unpaid" | "deposit_paid" | "paid" | "refunded";
  fileStatus: ArtworkUploadStatus;
  productionStatus: AdminOrderStatus;
  priority: AdminPriority;
  dueDate: string;
  createdAt: string;
  internalNotes: string[];
  activity: string[];
}

export interface AdminQuote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  quantity: string;
  deadline: string;
  fulfillmentMethod: "Pickup" | "Delivery";
  status: AdminQuoteStatus;
  priority: AdminPriority;
  estimatedValue: string;
  createdAt: string;
  projectDetails: string;
  internalNotes: string[];
  followUp: string;
}

export interface AdminUpload {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  customerName: string;
  relatedTo: string;
  status: ArtworkUploadStatus;
  priority: AdminPriority;
  notes: string;
}

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  relatedOrder: string;
  amount: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issuedAt: string;
  dueAt: string;
}

export interface AdminMessage {
  id: string;
  customerName: string;
  subject: string;
  channel: "quote" | "contact" | "checkout" | "support";
  priority: AdminPriority;
  status: "open" | "waiting" | "resolved";
  receivedAt: string;
  summary: string;
}
