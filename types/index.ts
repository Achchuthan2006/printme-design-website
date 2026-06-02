export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  intent: string;
  primaryCta: string;
  secondaryCta: string;
  categorySlugs: string[];
  relatedProductSlugs: string[];
  localIntentQueries: string[];
  proofPoints: string[];
  deliverables: string[];
  useCases: string[];
  process: string[];
  faqs: FaqItem[];
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

export type QuoteWorkflowStatus =
  | "submitted"
  | "under_review"
  | "waiting_for_files"
  | "quoted"
  | "approved"
  | "converted_to_order"
  | "closed";

export type OrderWorkflowStatus =
  | "draft"
  | "quote_review_required"
  | "payment_pending"
  | "paid"
  | "in_production"
  | "ready_for_pickup"
  | "shipped_delivered"
  | "completed"
  | "cancelled"
  | "on_hold";

export type PaymentWorkflowStatus =
  | "pending"
  | "requires_action"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "demo";

export type ProductMode = "direct-order" | "quote-only" | "hybrid";
export type ProductCtaMode = "direct-order" | "quote-first" | "upload-first" | "contact";
export type ProductOrderMethod =
  | "ready-template"
  | "customize-template"
  | "design-online"
  | "upload-finished-design"
  | "buy-now-upload-later"
  | "request-custom-design";

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
  productCountLabel?: string;
  overview?: string;
  useCases?: string[];
  searchTerms?: string[];
  spotlightSlugs?: string[];
  featuredLinks?: CatalogShortcut[];
  subcategoryGroups?: CatalogSubcategoryGroup[];
  merchandisingCollections?: CatalogCollection[];
  supportLinks?: CatalogShortcut[];
}

export interface CatalogShortcut {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface CatalogCollection {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export interface CatalogSubcategoryLink {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export interface CatalogSubcategoryGroup {
  title: string;
  description: string;
  items: CatalogSubcategoryLink[];
}

export interface CatalogSearchEntry {
  title: string;
  description: string;
  href: string;
  type: "category" | "product" | "service" | "template" | "support";
  keywords: string[];
  badge?: string;
}

export interface DiscoveryFacetOption {
  value: string;
  label: string;
  count: number;
}

export interface DiscoveryFacetGroup {
  id: string;
  label: string;
  type: "single" | "multi";
  helpText?: string;
  options: DiscoveryFacetOption[];
}

export interface DiscoveryRecoveryAction {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export interface DiscoveryTemplateResult {
  id: string;
  title: string;
  summary: string;
  industry: string;
  productSlug: string;
  href: string;
  badge?: string;
}

export interface IndustryPath {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  featuredProducts: string[];
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
  productLine?: string;
  parentProductSlug?: string;
  experienceSourceSlug?: string;
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

export type CatalogEntityType = "category" | "subcategory" | "family" | "product" | "service" | "bundle" | "support";
export type CatalogAttributeDataType = "enum" | "multi_enum" | "dimension" | "number" | "boolean" | "text";
export type CatalogAttributeApplicability = "identity" | "variant" | "option" | "add_on" | "merchandising" | "search" | "seo" | "production";
export type CatalogFacetInput = "checkbox" | "radio" | "swatch" | "range" | "pill";

export interface CatalogAttributeValueDefinition {
  value: string;
  label: string;
  synonyms?: string[];
  description?: string;
}

export interface CatalogAttributeDefinition {
  id: string;
  label: string;
  dataType: CatalogAttributeDataType;
  applicability: CatalogAttributeApplicability[];
  description: string;
  unit?: string;
  requiredForFamilies?: string[];
  allowedValues?: CatalogAttributeValueDefinition[];
}

export interface CatalogAttributeSet {
  id: string;
  title: string;
  description: string;
  requiredAttributeIds: string[];
  optionalAttributeIds: string[];
}

export interface CatalogAssetProfile {
  id: string;
  title: string;
  description: string;
  requiredAssets: string[];
  optionalAssets?: string[];
}

export interface CatalogFacetDefinition {
  id: string;
  label: string;
  attributeId: string;
  input: CatalogFacetInput;
  categories: string[];
  showWhenProductCountAtLeast?: number;
  helpText?: string;
}

export interface CatalogFamilyDefinition {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  customerSummary: string;
  productSlugs: string[];
  serviceSlugs?: string[];
  filterProfileId: string;
  attributeSetId: string;
}

export interface CatalogProductIntelligenceRecord {
  productSlug: string;
  familyId: string;
  primaryCategorySlug: string;
  canonicalProductType: string;
  searchTerms: string[];
  synonyms: string[];
  intentTags: string[];
  compatibility: {
    orderingPaths: ProductCtaMode[];
    templateReady: boolean;
    customQuoteRequired: boolean;
    uploadReady: boolean;
  };
  merchandising: {
    featured?: boolean;
    bestseller?: boolean;
    premium?: boolean;
    seasonal?: boolean;
    strategic?: boolean;
  };
  variantAxes: string[];
  optionAxes: string[];
  addOnAxes: string[];
  assetProfile: string[];
}

export interface CatalogSynonymEntry {
  phrase: string;
  mapsTo: string[];
  intent?: "product" | "service" | "material" | "finish" | "support" | "industry";
}

export interface CatalogGovernanceRole {
  id: string;
  title: string;
  responsibilities: string[];
}

export interface CatalogGovernanceRule {
  area: string;
  ownerRoleId: string;
  approverRoleId: string;
  rule: string;
}

export interface CatalogQualityRule {
  id: string;
  title: string;
  severity: "warning" | "error";
  appliesTo: CatalogEntityType[];
  description: string;
}

export interface CatalogAuditFinding {
  id: string;
  severity: "high" | "medium" | "low";
  area: "taxonomy" | "product_model" | "variants" | "search" | "filters" | "governance" | "seo" | "assets";
  title: string;
  detail: string;
  recommendation: string;
}

export interface CatalogImplementationPhase {
  id: string;
  title: string;
  objective: string;
  dependencies: string[];
  deliverables: string[];
}

export interface ProductTemplateView {
  id: string;
  label: string;
  headline: string;
  detail: string;
  accent?: "brand" | "ink" | "soft";
}

export type ProductTemplateEditableField = "fullName" | "companyName" | "phone" | "email" | "website" | "headline";

export interface ProductTemplatePaletteOption {
  id: string;
  label: string;
  swatch: string;
  surfaceClassName: string;
  textClassName: string;
}

export interface ProductTemplateFontOption {
  id: string;
  label: string;
  className: string;
  note: string;
}

export interface ProductTemplate {
  id: string;
  productSlug: string;
  title: string;
  industry: string;
  summary: string;
  recommendedSize: string;
  tags: string[];
  editableFields?: ProductTemplateEditableField[];
  styleDirection?: string;
  views: ProductTemplateView[];
  paletteOptions?: ProductTemplatePaletteOption[];
  fontOptions?: ProductTemplateFontOption[];
}

export interface InteractivePreviewMaterialOption {
  value: string;
  label: string;
  detail: string;
  tone: "clean" | "premium" | "durable" | "outdoor";
}

export interface InteractivePreviewFinishOption {
  value: string;
  label: string;
  detail: string;
  sheen: "soft" | "glossy" | "matte" | "natural";
}

export interface InteractivePreviewSizeOption {
  value: string;
  label: string;
  width: number;
  height: number;
  orientation?: "landscape" | "portrait" | "square";
  context: string;
  featured?: boolean;
}

export interface InteractivePreviewGuide {
  id: string;
  label: string;
  detail: string;
}

export interface ProductInteractivePreviewModel {
  slug: string;
  previewTitle: string;
  previewSummary: string;
  comparisonLabel: string;
  sizeOptions: InteractivePreviewSizeOption[];
  materialOptions: InteractivePreviewMaterialOption[];
  finishOptions: InteractivePreviewFinishOption[];
  featureHighlights: string[];
  guideOverlays: InteractivePreviewGuide[];
  mockupNote: string;
  recommendationPrompts: Array<{
    label: string;
    detail: string;
  }>;
}

export interface RecommendationReason {
  label: string;
  detail: string;
}

export interface TenantNavigationItem {
  label: string;
  href: string;
}

export interface TenantTheme {
  key: string;
  accentLabel: string;
  heroStyle: "core" | "corporate" | "franchise" | "reseller";
}

export interface TenantLocationProfile {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  contactName?: string;
  phone?: string;
  email?: string;
  supportsPickup: boolean;
  supportsDelivery: boolean;
  serviceArea?: string;
}

export interface TenantSiteConfig {
  name: string;
  brandName: string;
  tagline: string;
  domain: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  shortAddress: string;
  cityRegion: string;
  serviceArea: string;
  description: string;
  experience?: string;
  hours?: string[];
  logoSrc?: string;
  logoAlt?: string;
}

export interface PlatformTenant {
  slug: string;
  name: string;
  kind: "core" | "private_portal" | "franchise" | "white_label" | "reseller";
  status: "active" | "pilot" | "planned";
  publicAccess: "public" | "private";
  domains: string[];
  site: TenantSiteConfig;
  theme: TenantTheme;
  navigation: TenantNavigationItem[];
  locationProfiles: TenantLocationProfile[];
  capabilities: Array<
    | "retail_storefront"
    | "b2b_portal"
    | "white_label_branding"
    | "location_routing"
    | "brand_locked_templates"
    | "reseller_visibility"
    | "budget_controls"
    | "approval_routing"
  >;
  catalogPolicy: {
    mode: "global_with_overrides" | "private_catalog" | "franchise_subset" | "reseller_subset";
    allowedProductSlugs: string[];
  };
  governance: {
    templateControl: "open" | "brand_locked" | "location_limited";
    pricingControl: "central" | "central_with_location_overrides";
    localAdminMode: "none" | "location_admin" | "client_admin" | "reseller_admin";
  };
}

export interface ResolvedTenantContext {
  tenant: PlatformTenant;
  activeLocation?: TenantLocationProfile;
  navigation: TenantNavigationItem[];
}

export interface CroOpportunity {
  id: string;
  title: string;
  journey: string;
  evidence: string;
  likelyCause: string;
  recommendedAction: string;
  primaryKpi: string;
  impact: number;
  confidence: number;
  effort: number;
  businessValue: number;
  frictionSeverity: number;
}

export interface FunnelOptimizationPlan {
  id: string;
  funnel: string;
  dropOffPoint: string;
  likelyCause: string;
  recommendedFix: string;
  successMetric: string;
}

export interface ExperimentBlueprint {
  id: string;
  title: string;
  hypothesis: string;
  primaryKpi: string;
  audience: string;
  successThreshold: string;
  durationGuidance: string;
  effort: "low" | "medium" | "high";
  priority: "now" | "next" | "later";
}

export interface OptimizationLoopStep {
  title: string;
  detail: string;
}

export interface SmartProductRecommendation {
  slug: string;
  title: string;
  category: string;
  summary: string;
  recommendationType: "related" | "better_fit" | "premium" | "budget" | "paired" | "reorder";
  href: string;
  reasons: RecommendationReason[];
}

export interface SmartTemplateRecommendation {
  id: string;
  title: string;
  productSlug: string;
  industry: string;
  summary: string;
  recommendationType: "industry" | "style" | "popular" | "premium" | "branded";
  reasons: RecommendationReason[];
}

export interface SmartOrderPathRecommendation {
  path: ProductOrderMethod | "quote-first" | "contact";
  label: string;
  summary: string;
  reasons: RecommendationReason[];
  ctaLabel: string;
  href: string;
}

export interface SmartDecisionSuggestion {
  label: string;
  recommendation: string;
  detail: string;
}

export interface SmartDesignDirection {
  title: string;
  tone: string;
  layout: string;
  palette: string;
  fit: string;
}

export interface SmartCopySuggestion {
  label: string;
  text: string;
  useCase: string;
}

export interface FileReadinessSignal {
  label: string;
  severity: "info" | "warning" | "attention";
  detail: string;
}

export interface ReturningCustomerSuggestion {
  title: string;
  detail: string;
  href: string;
  actionLabel: string;
  tone: "default" | "attention" | "success";
}

export interface AdminAiInsight {
  title: string;
  detail: string;
  priority: "now" | "next" | "watch";
  actionLabel: string;
  href: string;
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
  pricingState?: "instant-price" | "estimated-price" | "custom-quote";
  pricingLabel?: string;
  pricingExplanation?: string;
}

export interface PricingAdjustmentLine {
  label: string;
  amount: number;
  kind: "base" | "quantity" | "option" | "turnaround" | "service" | "guardrail";
  note?: string;
}

export interface PricingEvaluation {
  unitPrice: number;
  estimatedTotal: number;
  pricingMode: "fixed-estimate" | "starting-from" | "quote-only";
  optionPrice: number;
  quantity: number;
  pricingPath: "instant" | "estimate" | "quote";
  pricingState: "instant-price" | "estimated-price" | "custom-quote";
  pricingLabel: string;
  pricingExplanation: string;
  minimumCharge: number;
  basePrice: number;
  methodFee: number;
  serviceFeeTotal: number;
  adjustments: PricingAdjustmentLine[];
  quoteReasons: string[];
  businessNotes: string[];
  guardrails: string[];
  paymentPathNote: string;
  pricingFactors: string[];
  businessRuleSummary: string[];
  customerSummary: string[];
  staffSummary: string[];
  quantityLabel?: string;
  turnaroundLabel?: string;
  canCheckoutDirectly: boolean;
  requiredReview: boolean;
}

export interface AccountWidget {
  title: string;
  value: string;
  description: string;
}

export interface CustomerProfile {
  id?: string;
  authUserId?: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  role?: "customer" | "admin";
  accountStatus?: "active" | "pending" | "paused";
  communicationPreferences?: {
    emailUpdates: boolean;
    smsUpdates: boolean;
    marketingEmails: boolean;
  };
}

export interface AccountDashboardData {
  profile: CustomerProfile;
  addresses: CustomerAddress[];
  orders: AccountOrder[];
  quotes: AccountQuote[];
  files: AccountFile[];
  invoices: AccountInvoice[];
  activity: AccountActivityItem[];
  reorders: AccountReorderTemplate[];
  savedDesigns?: AccountSavedDesign[];
  summary: Array<{ label: string; value: string; detail: string }>;
}

export interface AuthProfileSnapshot {
  profile: CustomerProfile;
  role: "customer" | "admin";
  isAdmin: boolean;
}

export interface CustomerAddress {
  id: string;
  label: string;
  recipient: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  instructions?: string;
  isDefaultPickup?: boolean;
  isDefaultDelivery?: boolean;
}

export interface AccountOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending_review" | "in_production" | "ready_for_pickup" | "completed" | "quote_required";
  total: string;
  fulfillmentMethod: string;
  items: string[];
  paymentLabel?: string;
  balanceLabel?: string;
  fileStatus?: ArtworkUploadStatus;
  nextStep?: string;
  reorderHref?: string;
  linkedFiles?: string[];
  deliveryWindow?: string;
  proofPortalId?: string;
  proofStatus?: CustomerProofStatus;
}

export interface AccountQuote {
  id: string;
  service: string;
  requestedDate: string;
  status: "new" | "reviewing" | "priced" | "approved" | "expired";
  summary: string;
  estimatedValue?: string;
  nextStep?: string;
  linkedFiles?: string[];
  proofPortalId?: string;
  proofStatus?: CustomerProofStatus;
}

export interface AccountFile {
  id: string;
  fileName: string;
  relatedTo: string;
  uploadedAt: string;
  fileSize?: string;
  fileType?: string;
  status: ArtworkUploadStatus;
  relatedType?: "order" | "quote" | "library";
  reviewNote?: string;
  reusable?: boolean;
}

export interface AccountInvoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  amount: string;
  status: "paid" | "unpaid" | "deposit_pending" | "partially_paid" | "void";
  paymentStageLabel?: string;
  amountPaid?: string;
  amountDue?: string;
  nextPaymentLabel?: string;
  dueLabel?: string;
  payNowHref?: string;
}

export interface AccountActivityItem {
  id: string;
  title: string;
  detail: string;
  date: string;
  entityType: "order" | "quote" | "file" | "invoice" | "support";
  href: string;
  tone?: "default" | "attention" | "success";
}

export interface AccountReorderTemplate {
  id: string;
  title: string;
  sourceType: "order" | "quote";
  sourceId: string;
  summary: string;
  lastUsed: string;
  recommendedPath: "cart" | "quote";
  href: string;
  tags: string[];
}

export interface AccountSavedDesign {
  id: string;
  title: string;
  productSlug: string;
  productTitle: string;
  source: "template" | "uploaded-artwork" | "design-support";
  updatedAt: string;
  status: "draft" | "ready" | "proofing";
  href: string;
  detail: string;
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

export type CheckoutPaymentMode = "full" | "deposit" | "review";
export type PaymentCollectionPath =
  | "instant_checkout"
  | "deposit_checkout"
  | "mixed_checkout_and_quote"
  | "review_then_invoice"
  | "quote_approval_then_payment";
export type PaymentReadinessState =
  | "review_required"
  | "deposit_pending"
  | "deposit_received"
  | "balance_due"
  | "paid_in_full"
  | "payment_pending";

export interface PaymentPlanSummary {
  checkoutMode: CheckoutPaymentMode;
  collectionPath: PaymentCollectionPath;
  readinessState: PaymentReadinessState;
  paymentHeadline: string;
  paymentCtaLabel: string;
  dueNowCents: number;
  dueLaterCents: number;
  subtotalCents: number;
  depositRate: number;
  depositRequired: boolean;
  invoiceEligible: boolean;
  allowsDirectCheckout: boolean;
  includesQuoteReviewItems: boolean;
  requiresQuoteApproval: boolean;
  requiresProofApproval: boolean;
  acceptedMethods: string[];
  blocksProductionUntil: string[];
  customerNotes: string[];
  staffNotes: string[];
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  fulfillmentMethod: "pickup" | "delivery";
  deliveryAddress?: CheckoutAddress;
  orderNotes?: string;
  paymentMode: CheckoutPaymentMode;
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
  amountDueNowCents: number;
  amountDueLaterCents: number;
  quoteReviewRequired: boolean;
  paymentMode: CheckoutPaymentMode;
  paymentPlan: PaymentPlanSummary;
  paymentStatus: PaymentWorkflowStatus;
  createdAt: string;
}

export interface QuoteRequestRecord {
  quoteNumber: string;
  status: QuoteWorkflowStatus;
  customerEmail: string;
  persisted: boolean;
  legacyFallback?: boolean;
}

export interface PersistedOrderRecord {
  orderNumber: string;
  workflowStatus: OrderWorkflowStatus;
  paymentStatus: PaymentWorkflowStatus;
  persisted: boolean;
}

export interface WorkflowEvent {
  entityType: "quote" | "order" | "upload" | "support";
  entityId: string;
  eventType: string;
  visibility: "internal" | "customer";
  metadata?: Record<string, unknown>;
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
  | "awaiting_customer_details"
  | "awaiting_files"
  | "quoted"
  | "awaiting_payment"
  | "paid"
  | "design_in_progress"
  | "proof_sent"
  | "waiting_for_proof_approval"
  | "approved_for_production"
  | "in_production"
  | "ready_for_pickup"
  | "shipped_delivered"
  | "completed"
  | "revision_requested"
  | "on_hold";

export type AdminQuoteStatus =
  | "new_quote"
  | "reviewing"
  | "waiting_for_files"
  | "awaiting_customer_details"
  | "quoted"
  | "customer_responded"
  | "approved"
  | "design_in_progress"
  | "proof_sent"
  | "waiting_for_proof_approval"
  | "revision_requested"
  | "converted_to_order"
  | "closed";

export type AdminWorkstream = "intake" | "design" | "prepress" | "production" | "fulfillment" | "support";
export type AdminProofStatus = "not_needed" | "preparing" | "sent" | "revision_requested" | "approved";
export type AdminBlockingReason = "missing_files" | "missing_details" | "waiting_for_payment" | "waiting_for_proof" | "internal_review" | "none";

export interface AdminAssignment {
  owner: string;
  role: "admin" | "support" | "designer" | "prepress" | "production";
  handoffTo?: string;
  workstream: AdminWorkstream;
}

export interface AdminWorkflowMilestone {
  label: string;
  state: "done" | "current" | "upcoming" | "blocked";
  note: string;
}

export interface AdminCommunicationItem {
  id: string;
  direction: "internal" | "customer";
  title: string;
  detail: string;
  happenedAt: string;
}

export interface AdminProofRecord {
  currentVersion: string;
  status: AdminProofStatus;
  lastAction: string;
  customerApprovalNeeded: boolean;
  notes: string[];
  timeline?: Array<{
    label: string;
    happenedAt: string;
    actor: string;
    state: "done" | "current" | "upcoming";
  }>;
}

export interface AdminIntakeTicket {
  id: string;
  reference: string;
  type: "order" | "quote" | "upload" | "custom_design";
  product: string;
  customerName: string;
  company?: string;
  orderMethod: ProductOrderMethod | "quote-first";
  status: string;
  priority: AdminPriority;
  workstream: AdminWorkstream;
  assignedTo: string;
  summary: string;
  blockers: string[];
  nextAction: string;
  href: string;
  createdAt: string;
  productCategory?: string;
  customerEmail?: string;
  turnaroundExpectation?: string;
  specsPreview?: string[];
  fileVisibility?: "missing" | "uploaded" | "review_required" | "ready";
  proofVisibility?: "not_needed" | "needed" | "pending" | "approved";
  paymentVisibility?: "not_started" | "quote_pending" | "deposit_needed" | "paid";
}

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
  customerCompany?: string;
  service: string;
  items: string[];
  total: string;
  fulfillmentMethod: "Pickup" | "Delivery";
  paymentStatus: "unpaid" | "deposit_paid" | "paid" | "refunded";
  paymentStageLabel?: string;
  amountPaid?: string;
  amountDue?: string;
  fileStatus: ArtworkUploadStatus;
  productionStatus: AdminOrderStatus;
  priority: AdminPriority;
  orderMethod: ProductOrderMethod | "quote-first";
  selectedSpecs: string[];
  templateTitle?: string;
  customizationSummary?: string;
  designRequired?: boolean;
  requestedEdits?: string[];
  customerInstructions?: string[];
  turnaroundExpectation?: string;
  proof: AdminProofRecord;
  assignment: AdminAssignment;
  blockers: AdminBlockingReason[];
  nextAction: string;
  productionStage: "prepress" | "design" | "printing" | "finishing" | "dispatch";
  dueDate: string;
  createdAt: string;
  internalNotes: string[];
  activity: string[];
  communication: AdminCommunicationItem[];
  milestones: AdminWorkflowMilestone[];
  invoiceStatus?: "not_needed" | "draft" | "sent" | "paid";
  depositRequired?: boolean;
  paymentPlan?: PaymentPlanSummary;
  commercialReadiness?: Array<{
    label: string;
    status: "ready" | "blocked" | "pending";
    note: string;
  }>;
  fileChecklist?: Array<{
    label: string;
    status: "ready" | "issue" | "missing";
    note: string;
  }>;
  productionChecklist?: Array<{
    label: string;
    status: "ready" | "pending" | "blocked";
    note: string;
  }>;
}

export interface AdminQuote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  service: string;
  quantity: string;
  deadline: string;
  fulfillmentMethod: "Pickup" | "Delivery";
  status: AdminQuoteStatus;
  priority: AdminPriority;
  orderMethod: ProductOrderMethod | "quote-first";
  selectedSpecs: string[];
  templateTitle?: string;
  designRequired?: boolean;
  requestedEdits?: string[];
  turnaroundExpectation?: string;
  proof: AdminProofRecord;
  assignment: AdminAssignment;
  blockers: AdminBlockingReason[];
  nextAction: string;
  estimatedValue: string;
  paymentStageLabel?: string;
  createdAt: string;
  projectDetails: string;
  internalNotes: string[];
  followUp: string;
  paymentPlan?: PaymentPlanSummary;
  communication: AdminCommunicationItem[];
  milestones: AdminWorkflowMilestone[];
  commercialReadiness?: Array<{
    label: string;
    status: "ready" | "blocked" | "pending";
    note: string;
  }>;
  fileChecklist?: Array<{
    label: string;
    status: "ready" | "issue" | "missing";
    note: string;
  }>;
}

export interface AdminUpload {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  customerName: string;
  relatedTo: string;
  linkedProduct: string;
  orderMethod: ProductOrderMethod | "quote-first";
  status: ArtworkUploadStatus;
  priority: AdminPriority;
  completeness: "complete" | "needs_assets" | "needs_clarification";
  assignment: AdminAssignment;
  notes: string;
  issueFlags?: string[];
}

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  relatedOrder: string;
  amount: string;
  status: "draft" | "sent" | "partially_paid" | "paid" | "overdue";
  paymentStageLabel?: string;
  amountPaid?: string;
  amountDue?: string;
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

export interface AdminWorkflowEvent {
  id: string;
  entityType: "order" | "quote" | "upload" | "customer" | "invoice" | "product";
  entityId: string;
  title: string;
  detail: string;
  actor: string;
  occurredAt: string;
  tone?: "default" | "attention" | "success";
}

export interface AdminUrgentTask {
  id: string;
  title: string;
  detail: string;
  href: string;
  priority: AdminPriority;
  category: "quote" | "order" | "upload" | "customer" | "product";
}

export interface AdminProductVariantOption {
  id: string;
  label: string;
  value: string;
  pricingHint?: string;
  skuHint?: string;
  turnaroundHint?: string;
}

export interface AdminProductVariantGroup {
  id: string;
  title: string;
  scope: "shared" | "product_specific";
  required?: boolean;
  options: AdminProductVariantOption[];
}

export interface AdminProductCatalogItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  orderMode: "direct-order" | "hybrid" | "quote-only" | "contact";
  storefrontStatus: "active" | "draft" | "inactive";
  featured: boolean;
  startingPrice?: string;
  turnaround: string;
  linkedFaqCount: number;
  relatedServices: string[];
  variantGroups: string[];
  internalNote: string;
}

export type ReportingWindow = "today" | "7d" | "30d" | "90d";

export interface AdminKpiMetric {
  label: string;
  value: string;
  detail: string;
  delta?: string;
  direction?: "up" | "down" | "flat";
  tone?: "default" | "positive" | "attention";
  href?: string;
}

export interface AdminInsightRow {
  label: string;
  value: string;
  detail: string;
  change?: string;
  href?: string;
}

export interface AdminOperationalAlert {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical" | "positive";
  category: "quote" | "order" | "upload" | "payment" | "customer" | "operations";
  ageLabel: string;
  href: string;
  actionLabel: string;
}

export interface AdminNotificationIntelligenceItem {
  id: string;
  title: string;
  detail: string;
  channel: "email" | "workflow" | "payment" | "support" | "system";
  audience: "customer" | "staff" | "both";
  priority: AdminPriority;
  status: "queued" | "sent" | "failed" | "action_needed" | "read";
  happenedAt: string;
  href: string;
}

export interface AdminCommandCenterSnapshot {
  window: ReportingWindow;
  windowLabel: string;
  comparisonLabel: string;
  kpis: AdminKpiMetric[];
  salesInsights: AdminInsightRow[];
  operationsInsights: AdminInsightRow[];
  customerInsights: AdminInsightRow[];
  productInsights: AdminInsightRow[];
  alerts: AdminOperationalAlert[];
  notifications: AdminNotificationIntelligenceItem[];
  activity: AdminWorkflowEvent[];
}

export type CustomerProofStatus =
  | "proof_in_preparation"
  | "proof_ready_for_review"
  | "awaiting_customer_approval"
  | "revision_requested"
  | "updated_proof_sent"
  | "approved_for_production"
  | "stalled_pending_response";

export interface ProofVersionSurface {
  id: string;
  label: string;
  side: "front" | "back" | "inside" | "outside" | "page" | "panel";
  headline: string;
  summary: string;
  keyFields: string[];
  notes?: string;
}

export interface ProofVersionRecord {
  id: string;
  versionNumber: number;
  label: string;
  status: "current" | "outdated" | "approved";
  releasedAt: string;
  releasedBy: string;
  changeSummary: string[];
  staffNotes: string[];
  customerInstructions: string[];
  surfaces: ProofVersionSurface[];
}

export interface ProofActionRecord {
  id: string;
  type: "proof_prepared" | "proof_sent" | "revision_requested" | "customer_comment" | "reminder_sent" | "approved" | "production_released";
  actor: "customer" | "support" | "designer" | "prepress" | "production" | "system";
  happenedAt: string;
  title: string;
  detail: string;
  versionLabel: string;
  visibility: "customer" | "staff" | "both";
}

export interface ProofRevisionCategory {
  id: string;
  label: string;
  description: string;
}

export interface ProofReviewChecklistItem {
  id: string;
  label: string;
  detail: string;
  required: boolean;
}

export interface ProofPortalRecord {
  id: string;
  orderId?: string;
  quoteId?: string;
  orderNumber: string;
  jobName: string;
  customerName: string;
  customerCompany?: string;
  orderSummary: string[];
  orderMethod: ProductOrderMethod | "quote-first";
  status: CustomerProofStatus;
  currentVersionId: string;
  versions: ProofVersionRecord[];
  actions: ProofActionRecord[];
  reviewChecklist: ProofReviewChecklistItem[];
  revisionCategories: ProofRevisionCategory[];
  nextStepMessage: string;
  approvalWarning: string;
  supportMessage: string;
  remindAfter: string;
  lastCustomerAction?: string;
  proofScope: "single-piece" | "double-sided" | "multi-panel" | "multi-page";
  productionBlockedUntilApproval: boolean;
}

export interface AdminWorkflowAuditItem {
  id: string;
  title: string;
  priority: "now" | "next" | "later";
  owner: "admin" | "support" | "design" | "prepress" | "production" | "shared";
  summary: string;
  risks: string[];
  workflowCoverage: string[];
}

export interface AdminRoleFocusCard {
  id: string;
  role: "admin_owner" | "support" | "designer" | "production";
  title: string;
  summary: string;
  focusAreas: string[];
  primaryMetrics: string[];
}

export interface AdminProductionQueueJob {
  id: string;
  reference: string;
  product: string;
  productFamily: string;
  stage: string;
  dueDate: string;
  assignedTo: string;
  note: string;
  priority: AdminPriority;
  readyForPrint: boolean;
  readyForFinishing: boolean;
  readyForDispatch: boolean;
  turnaround: string;
}

export type PlatformCapabilityLayer =
  | "experience"
  | "domain"
  | "shared_service"
  | "integration"
  | "governance";

export type PlatformEvolutionStage =
  | "existing_foundation"
  | "modularize_now"
  | "extract_when_scaled"
  | "external_system_boundary";

export type PlatformInteractionMode = "sync_api" | "async_event" | "scheduled_sync" | "admin_console";

export interface PlatformAuditCapability {
  id: string;
  title: string;
  layer: PlatformCapabilityLayer;
  currentState: string;
  targetState: string;
  monolithRisk: "low" | "medium" | "high";
  recommendedStage: PlatformEvolutionStage;
  keepSimple: boolean;
  currentTouchpoints: string[];
  notes: string[];
}

export interface PlatformExperienceSurface {
  id: string;
  title: string;
  audience: string;
  primaryJobs: string[];
  consumesModules: string[];
  sharedServices: string[];
}

export interface PlatformDomainModule {
  id: string;
  title: string;
  mission: string;
  owner: string;
  layer: Extract<PlatformCapabilityLayer, "domain" | "shared_service" | "integration" | "governance">;
  currentFootprint: string[];
  ownsData: string[];
  apiSurfaceIds: string[];
  dependsOn: string[];
  consumers: string[];
  evolutionStage: PlatformEvolutionStage;
}

export interface PlatformApiSurface {
  id: string;
  title: string;
  ownerModuleId: string;
  mode: PlatformInteractionMode;
  entities: string[];
  primaryConsumers: string[];
  responsibilities: string[];
  guardrails: string[];
}

export interface PlatformDataOwnership {
  entity: string;
  ownerModuleId: string;
  systemOfRecord: string;
  replicatedConsumers: string[];
  governanceNotes: string[];
}

export interface PlatformIntegrationDefinition {
  id: string;
  title: string;
  category:
    | "crm"
    | "erp"
    | "payments"
    | "messaging"
    | "shipping"
    | "pim_cms"
    | "production_mis"
    | "analytics"
    | "ai"
    | "support";
  ownerModuleId: string;
  direction: "inbound" | "outbound" | "bidirectional";
  transport: "api" | "webhook" | "file" | "event" | "scheduled_sync" | "manual_fallback";
  orchestrationOwner: string;
  businessPurpose: string;
  resilienceRules: string[];
}

export interface PlatformGovernancePolicy {
  id: string;
  area: string;
  decisionOwner: string;
  requiredReviewers: string[];
  trigger: string;
  policy: string;
}

export interface PlatformOperatingModelLane {
  id: string;
  title: string;
  purpose: string;
  owner: string;
  responsibilities: string[];
  successMeasures: string[];
}

export interface PlatformModernizationPhase {
  id: string;
  title: string;
  objective: string;
  priority: "now" | "next" | "later";
  modules: string[];
  dependencies: string[];
  deliverables: string[];
  exitCriteria: string[];
}

export interface PlatformBusinessValueOutcome {
  id: string;
  outcome: string;
  enabledBy: string[];
  businessImpact: string;
}

export interface UnifiedPlatformCapability {
  id: string;
  title: string;
  pillar:
    | "storefront"
    | "catalog"
    | "design"
    | "interaction"
    | "ordering"
    | "workflow"
    | "account"
    | "operations"
    | "analytics"
    | "b2b"
    | "ai"
    | "automation"
    | "tenant"
    | "design_system";
  journeyStages: string[];
  primaryUsers: string[];
  dependsOn: string[];
  platformModules: string[];
  currentState: "live" | "in_progress" | "planned";
  strategicRole: string;
}

export interface UnifiedUserExperienceModel {
  id: string;
  userType:
    | "first_time_retail"
    | "repeat_retail"
    | "small_business"
    | "business_account"
    | "corporate_portal_user"
    | "branch_location_user"
    | "staff_admin"
    | "reseller_white_label";
  headline: string;
  goals: string[];
  preferredEntryPoints: string[];
  coreFlows: string[];
  criticalPlatformServices: string[];
}

export interface UnifiedPlatformFlow {
  id: string;
  title: string;
  audience: string[];
  steps: string[];
  successOutcome: string;
  backingCapabilities: string[];
}

export interface UnifiedImplementationPhase {
  id: string;
  title: string;
  objective: string;
  priority: "now" | "next" | "later";
  scope: string[];
  dependencies: string[];
  outputs: string[];
}

export interface TenantExpansionAuditFinding {
  id: string;
  priority: "critical" | "high" | "medium";
  area:
    | "tenant_model"
    | "branding"
    | "permissions"
    | "catalog"
    | "templates"
    | "routing"
    | "analytics"
    | "provisioning";
  title: string;
  risk: string;
  opportunity: string;
}

export interface TenantArchetypeDefinition {
  id: string;
  title: string;
  mode:
    | "core_brand"
    | "private_portal"
    | "franchise_network"
    | "white_label_storefront"
    | "reseller_workspace"
    | "agency_client_hub"
    | "multi_brand_substore";
  summary: string;
  requiredCapabilities: string[];
  centralControls: string[];
  localControls: string[];
}

export interface TenantControlPolicy {
  id: string;
  scope: "platform" | "tenant" | "brand" | "location" | "account";
  centralOwner: string;
  localOwner?: string;
  controlledAssets: string[];
  policy: string;
}

export interface TenantProvisioningBlueprint {
  id: string;
  title: string;
  tenantMode: TenantArchetypeDefinition["mode"];
  setupSteps: string[];
  defaultModules: string[];
  requiredPolicies: string[];
  launchChecks: string[];
}

export interface TenantRoutingRule {
  id: string;
  title: string;
  inputs: string[];
  outputs: string[];
  ownedBy: string;
  notes: string[];
}

export interface TenantAnalyticsView {
  id: string;
  scope: "platform" | "tenant" | "brand" | "location" | "account";
  title: string;
  metrics: string[];
  decisionsEnabled: string[];
}

export interface TenantExpansionPhase {
  id: string;
  title: string;
  objective: string;
  priority: "now" | "next" | "later";
  dependencies: string[];
  deliverables: string[];
}
