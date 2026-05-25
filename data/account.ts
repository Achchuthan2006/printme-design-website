import { AccountFile, AccountInvoice, AccountOrder, AccountQuote } from "@/types";

export const demoOrders: AccountOrder[] = [
  {
    id: "ord-demo-1",
    orderNumber: "PM-20260522-A12FQ",
    date: "May 22, 2026",
    status: "pending_review",
    total: "$128.00",
    fulfillmentMethod: "In-store pickup",
    items: ["Business Cards", "Flyers"],
  },
  {
    id: "ord-demo-2",
    orderNumber: "PM-20260518-K91PR",
    date: "May 18, 2026",
    status: "completed",
    total: "$89.00",
    fulfillmentMethod: "Local delivery",
    items: ["Banners"],
  },
];

export const demoQuotes: AccountQuote[] = [
  {
    id: "quote-demo-1",
    service: "Engineering Drawing Prints",
    requestedDate: "May 21, 2026",
    status: "reviewing",
    summary: "Large-format drawing sets for contractor pickup.",
  },
  {
    id: "quote-demo-2",
    service: "Custom Orders",
    requestedDate: "May 19, 2026",
    status: "priced",
    summary: "Custom packaging labels and branded inserts.",
  },
];

export const demoFiles: AccountFile[] = [
  {
    id: "file-demo-1",
    fileName: "business-card-front-back.pdf",
    relatedTo: "PM-20260522-A12FQ",
    uploadedAt: "May 22, 2026",
    fileSize: "2.4 MB",
    fileType: "PDF",
    status: "awaiting_review",
  },
  {
    id: "file-demo-2",
    fileName: "banner-artwork-v2.pdf",
    relatedTo: "PM-20260518-K91PR",
    uploadedAt: "May 18, 2026",
    fileSize: "8.7 MB",
    fileType: "PDF",
    status: "approved_for_print",
  },
];

export const demoInvoices: AccountInvoice[] = [
  {
    id: "inv-demo-1",
    invoiceNumber: "INV-20260522-001",
    orderNumber: "PM-20260522-A12FQ",
    date: "May 22, 2026",
    amount: "$128.00",
    status: "unpaid",
  },
  {
    id: "inv-demo-2",
    invoiceNumber: "INV-20260518-002",
    orderNumber: "PM-20260518-K91PR",
    date: "May 18, 2026",
    amount: "$89.00",
    status: "paid",
  },
];

export const accountOrderProgress: Record<string, Array<{ label: string; detail: string; status: "done" | "current" | "upcoming" | "attention" }>> = {
  "ord-demo-1": [
    { label: "Order received", detail: "PrintMe has your configured order and uploaded files.", status: "done" },
    { label: "Artwork under review", detail: "A file check is in progress before production is locked in.", status: "current" },
    { label: "Production starts", detail: "Once artwork is cleared, the job moves into print and finishing.", status: "upcoming" },
    { label: "Pickup notification", detail: "You will get the next update when the order is ready at the Scarborough shop.", status: "upcoming" },
  ],
  "ord-demo-2": [
    { label: "Order received", detail: "The order was approved and paid successfully.", status: "done" },
    { label: "Production completed", detail: "PrintMe finished the banner job and confirmed dispatch.", status: "done" },
    { label: "Delivered", detail: "This delivery order has been completed.", status: "done" },
  ],
};

export const accountQuoteProgress: Record<string, Array<{ label: string; detail: string; status: "done" | "current" | "upcoming" | "attention" }>> = {
  "quote-demo-1": [
    { label: "Quote received", detail: "Your request is in the queue with service details and timing.", status: "done" },
    { label: "Specifications under review", detail: "PrintMe is checking file readiness, quantity, and large-format needs.", status: "current" },
    { label: "Pricing and turnaround response", detail: "Next update will confirm the cleanest production path.", status: "upcoming" },
  ],
  "quote-demo-2": [
    { label: "Quote received", detail: "Custom label requirements were captured successfully.", status: "done" },
    { label: "Pricing prepared", detail: "This quote is ready for approval or follow-up questions.", status: "current" },
    { label: "Convert to order", detail: "Once approved, PrintMe can move this into a production-ready order.", status: "upcoming" },
  ],
};

export const accountSupportShortcuts = [
  {
    title: "Ask about turnaround",
    detail: "Use this when timing is moving, a pickup window matters, or a proof is holding the job.",
    href: "/support",
    cta: "Open Support",
  },
  {
    title: "Reuse an existing file",
    detail: "Quote or reorder faster by referencing artwork already attached to your account.",
    href: "/account/files",
    cta: "Review Files",
  },
  {
    title: "Start a repeat job",
    detail: "Use a new quote when quantity, finishing, or dates changed from a previous order.",
    href: "/quote-request",
    cta: "Request Repeat Quote",
  },
];

export const accountHealthSummary = [
  { label: "Active jobs", value: "2", detail: "Orders and quotes that still need an update or approval." },
  { label: "Files waiting", value: "1", detail: "Artwork currently awaiting review before production." },
  { label: "Ready to reorder", value: "2", detail: "Completed or priced jobs that can be restarted quickly." },
  { label: "Billing items", value: "1", detail: "Invoices or payment actions that may need attention." },
];
