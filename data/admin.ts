import {
  AdminCustomerSummary,
  AdminInvoice,
  AdminMessage,
  AdminOrder,
  AdminOrderStatus,
  AdminQuote,
  AdminQuoteStatus,
  AdminUpload,
  ArtworkUploadStatus,
} from "@/types";

export const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Quotes", href: "/admin/quotes" },
  { label: "Uploads", href: "/admin/uploads" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Products", href: "/admin/products" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Settings", href: "/admin/settings" },
];

export const orderStatusLabels: Record<AdminOrderStatus, string> = {
  new: "New",
  awaiting_review: "Awaiting Review",
  quoted: "Quoted",
  awaiting_payment: "Awaiting Payment",
  paid: "Paid",
  in_production: "In Production",
  ready_for_pickup: "Ready for Pickup",
  shipped_delivered: "Shipped / Delivered",
  completed: "Completed",
  on_hold: "On Hold",
};

export const quoteStatusLabels: Record<AdminQuoteStatus, string> = {
  new_quote: "New Quote",
  reviewing: "Reviewing",
  waiting_for_files: "Waiting for Files",
  quoted: "Quoted",
  customer_responded: "Customer Responded",
  approved: "Approved",
  converted_to_order: "Converted to Order",
  closed: "Closed",
};

export const uploadStatusLabels: Record<ArtworkUploadStatus, string> = {
  uploaded: "Uploaded",
  awaiting_review: "Awaiting Review",
  needs_changes: "Needs Changes",
  approved_for_print: "Approved for Print",
  proof_required: "Proof Required",
  ready_for_production: "Ready for Production",
};

export const adminCustomers: AdminCustomerSummary[] = [
  {
    id: "cus_northline",
    name: "Priya S.",
    email: "priya@northlinemarketing.ca",
    phone: "416-555-0148",
    company: "Northline Marketing",
    tags: ["Repeat buyer", "Marketing"],
    lastActivity: "Today",
    lifetimeValue: "$1,840",
    notes: "Often orders flyers and brochures for local campaigns.",
  },
  {
    id: "cus_highland",
    name: "Jason M.",
    email: "jason@highlandcleaning.ca",
    phone: "647-555-0192",
    company: "Highland Cleaning",
    tags: ["Rush jobs", "Business cards"],
    lastActivity: "Yesterday",
    lifetimeValue: "$620",
  },
  {
    id: "cus_eventline",
    name: "David R.",
    email: "david@eventline.ca",
    phone: "416-555-0181",
    company: "EventLine",
    tags: ["Large format", "Pickup"],
    lastActivity: "2 days ago",
    lifetimeValue: "$2,350",
  },
];

export const adminOrders: AdminOrder[] = [
  {
    id: "ord_1048",
    orderNumber: "PM-1048",
    customerId: "cus_northline",
    customerName: "Priya S.",
    customerEmail: "priya@northlinemarketing.ca",
    customerPhone: "416-555-0148",
    service: "Flyers",
    items: ["1,000 flyers", "Gloss text stock", "Double-sided colour"],
    total: "$248.00",
    fulfillmentMethod: "Pickup",
    paymentStatus: "paid",
    fileStatus: "approved_for_print",
    productionStatus: "in_production",
    priority: "high",
    dueDate: "May 24, 2026",
    createdAt: "May 22, 2026",
    internalNotes: ["Artwork approved. Customer needs pickup before 3 PM."],
    activity: ["Payment received", "Artwork approved for print", "Moved to production queue"],
  },
  {
    id: "ord_1047",
    orderNumber: "PM-1047",
    customerId: "cus_highland",
    customerName: "Jason M.",
    customerEmail: "jason@highlandcleaning.ca",
    customerPhone: "647-555-0192",
    service: "Business Cards",
    items: ["500 business cards", "Matte finish", "Double-sided colour"],
    total: "$89.00",
    fulfillmentMethod: "Pickup",
    paymentStatus: "deposit_paid",
    fileStatus: "proof_required",
    productionStatus: "awaiting_review",
    priority: "normal",
    dueDate: "May 25, 2026",
    createdAt: "May 21, 2026",
    internalNotes: ["Logo needs final proof confirmation."],
    activity: ["Deposit captured", "Proof requested"],
  },
  {
    id: "ord_1046",
    orderNumber: "PM-1046",
    customerId: "cus_eventline",
    customerName: "David R.",
    customerEmail: "david@eventline.ca",
    customerPhone: "416-555-0181",
    service: "Banners",
    items: ["2 vinyl banners", "Grommets", "Outdoor use"],
    total: "$312.00",
    fulfillmentMethod: "Delivery",
    paymentStatus: "paid",
    fileStatus: "ready_for_production",
    productionStatus: "ready_for_pickup",
    priority: "urgent",
    dueDate: "May 22, 2026",
    createdAt: "May 20, 2026",
    internalNotes: ["Call before delivery. Confirm address at dispatch."],
    activity: ["Production complete", "Ready for dispatch"],
  },
];

export const adminQuotes: AdminQuote[] = [
  {
    id: "quo_3021",
    quoteNumber: "Q-3021",
    customerId: "cus_northline",
    customerName: "Priya S.",
    customerEmail: "priya@northlinemarketing.ca",
    customerPhone: "416-555-0148",
    service: "Brochures",
    quantity: "750",
    deadline: "May 29, 2026",
    fulfillmentMethod: "Pickup",
    status: "reviewing",
    priority: "high",
    estimatedValue: "$420-$520",
    createdAt: "Today",
    projectDetails: "Tri-fold brochure for a Scarborough service campaign. Needs stock recommendation.",
    internalNotes: ["Ask if folding is letterfold or z-fold."],
    followUp: "Respond by end of day",
  },
  {
    id: "quo_3020",
    quoteNumber: "Q-3020",
    customerId: "cus_eventline",
    customerName: "David R.",
    customerEmail: "david@eventline.ca",
    customerPhone: "416-555-0181",
    service: "Custom Orders",
    quantity: "Custom",
    deadline: "June 3, 2026",
    fulfillmentMethod: "Delivery",
    status: "waiting_for_files",
    priority: "normal",
    estimatedValue: "Quote pending",
    createdAt: "Yesterday",
    projectDetails: "Event signage bundle with multiple sizes and sponsor logos.",
    internalNotes: ["Need packaged files before estimating production time."],
    followUp: "Waiting on artwork",
  },
];

export const adminUploads: AdminUpload[] = [
  {
    id: "upl_901",
    fileName: "northline-flyer-final.pdf",
    fileType: "PDF",
    fileSize: "18.4 MB",
    uploadedAt: "Today, 9:18 AM",
    customerName: "Priya S.",
    relatedTo: "PM-1048",
    status: "approved_for_print",
    priority: "high",
    notes: "Bleed and safe margins confirmed.",
  },
  {
    id: "upl_900",
    fileName: "highland-card-logo.png",
    fileType: "PNG",
    fileSize: "2.1 MB",
    uploadedAt: "Yesterday",
    customerName: "Jason M.",
    relatedTo: "PM-1047",
    status: "proof_required",
    priority: "normal",
    notes: "Low-resolution source. Proof approval recommended.",
  },
  {
    id: "upl_899",
    fileName: "eventline-banner-artwork.zip",
    fileType: "ZIP",
    fileSize: "42.7 MB",
    uploadedAt: "May 20, 2026",
    customerName: "David R.",
    relatedTo: "PM-1046",
    status: "ready_for_production",
    priority: "urgent",
    notes: "Packaged artwork includes linked assets.",
  },
];

export const adminInvoices: AdminInvoice[] = [
  { id: "inv_801", invoiceNumber: "INV-801", customerName: "Priya S.", relatedOrder: "PM-1048", amount: "$248.00", status: "paid", issuedAt: "May 22, 2026", dueAt: "Paid" },
  { id: "inv_800", invoiceNumber: "INV-800", customerName: "Jason M.", relatedOrder: "PM-1047", amount: "$89.00", status: "sent", issuedAt: "May 21, 2026", dueAt: "May 25, 2026" },
  { id: "inv_799", invoiceNumber: "INV-799", customerName: "David R.", relatedOrder: "PM-1046", amount: "$312.00", status: "paid", issuedAt: "May 20, 2026", dueAt: "Paid" },
];

export const adminMessages: AdminMessage[] = [
  {
    id: "msg_701",
    customerName: "Amira K.",
    subject: "Can you print menus by tomorrow?",
    channel: "contact",
    priority: "high",
    status: "open",
    receivedAt: "18 min ago",
    summary: "Needs 80 laminated menus and wants to confirm same-day options.",
  },
  {
    id: "msg_700",
    customerName: "Jason M.",
    subject: "Business card proof",
    channel: "quote",
    priority: "normal",
    status: "waiting",
    receivedAt: "Yesterday",
    summary: "Customer asked whether the logo can be sharpened before approval.",
  },
];

export const adminDashboardMetrics = [
  { label: "New Quotes", value: String(adminQuotes.filter((quote) => quote.status === "reviewing" || quote.status === "new_quote").length), detail: "Need pricing or follow-up today" },
  { label: "Active Orders", value: String(adminOrders.filter((order) => !["completed", "shipped_delivered"].includes(order.productionStatus)).length), detail: "Jobs currently moving through production" },
  { label: "Files to Review", value: String(adminUploads.filter((upload) => ["uploaded", "proof_required", "awaiting_review"].includes(upload.status)).length), detail: "Artwork checks before print" },
  { label: "Ready for Pickup", value: String(adminOrders.filter((order) => order.productionStatus === "ready_for_pickup").length), detail: "Customer handoff or dispatch needed" },
];

export function getAdminOrderById(id: string) {
  return adminOrders.find((order) => order.id === id);
}

export function getAdminQuoteById(id: string) {
  return adminQuotes.find((quote) => quote.id === id);
}
