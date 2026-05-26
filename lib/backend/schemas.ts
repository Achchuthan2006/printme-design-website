import { z } from "zod";
import { uploadWorkflowStatuses } from "@/lib/backend/workflows";

export const cartItemSchema = z.object({
  id: z.string(),
  productSlug: z.string(),
  title: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  estimatedTotal: z.number().min(0),
  pricingMode: z.enum(["fixed-estimate", "starting-from", "quote-only"]),
  mode: z.enum(["direct-order", "quote-only", "hybrid"]),
  options: z.record(z.string(), z.string()),
  optionLabels: z.array(z.object({ label: z.string(), value: z.string() })),
  notes: z.string().max(2000).optional(),
  fulfillmentMethod: z.string().max(120).optional(),
  turnaround: z.string().max(120).optional(),
  quoteOnly: z.boolean().optional(),
});

export const checkoutRequestSchema = z
  .object({
    customer: z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(7),
      companyName: z.string().max(160).optional(),
    }),
    fulfillmentMethod: z.enum(["pickup", "delivery"]),
    deliveryAddress: z
      .object({
        addressLine1: z.string().min(1),
        addressLine2: z.string().optional(),
        city: z.string().min(1),
        province: z.string().min(1),
        postalCode: z.string().min(1),
      })
      .optional(),
    orderNotes: z.string().max(2000).optional(),
    paymentMode: z.enum(["full", "deposit"]),
    items: z.array(cartItemSchema).min(1),
    subtotal: z.number().min(0),
  })
  .superRefine((value, context) => {
    if (value.fulfillmentMethod === "delivery" && !value.deliveryAddress?.addressLine1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a delivery address.",
        path: ["deliveryAddress", "addressLine1"],
      });
    }
  });

export const quoteRequestApiSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  companyName: z.string().max(160).optional(),
  serviceNeeded: z.string().min(2, "Please select a service."),
  quantity: z.string().min(1, "Please enter the quantity."),
  preferredDeadline: z.string().min(1, "Please choose a preferred deadline."),
  fulfillmentMethod: z.string().min(1, "Please select pickup or delivery."),
  projectDetails: z
    .string()
    .min(10, "Please share a few details about your project.")
    .max(2000, "Please keep the project details under 2000 characters."),
});

export const requestMetaSchema = z.object({
  ipAddress: z.string(),
  userAgent: z.string().optional(),
  referer: z.string().optional(),
});

export const uploadMetadataSchema = z.object({
  id: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().min(0),
  mimeType: z.string().min(1),
  bucket: z.string().min(1),
  path: z.string().nullable(),
  status: z.enum(uploadWorkflowStatuses),
  context: z.object({
    scope: z.enum(["quote", "order", "account", "product"]),
    quoteId: z.string().optional(),
    orderId: z.string().optional(),
    customerId: z.string().optional(),
    productSlug: z.string().optional(),
  }),
});

export const signedUploadRequestSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().min(0),
  context: uploadMetadataSchema.shape.context,
});

export const idempotencyKeySchema = z.string().trim().min(8).max(160);

export const stripeCheckoutMetadataSchema = z.object({
  orderNumber: z.string(),
  paymentMode: z.enum(["full", "deposit"]),
  quoteReviewRequired: z.enum(["true", "false"]),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
export type QuoteRequestApiInput = z.infer<typeof quoteRequestApiSchema>;
export type RequestMeta = z.infer<typeof requestMetaSchema>;
export type UploadMetadataInput = z.infer<typeof uploadMetadataSchema>;
export type SignedUploadRequestInput = z.infer<typeof signedUploadRequestSchema>;
