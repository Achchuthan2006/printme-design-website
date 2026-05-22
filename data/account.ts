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
