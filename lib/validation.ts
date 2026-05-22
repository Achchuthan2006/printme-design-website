import { z } from "zod";

export const quoteRequestSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  companyName: z.string().optional(),
  serviceNeeded: z.string().min(2, "Please select a service."),
  quantity: z.string().min(1, "Please enter the quantity."),
  preferredDeadline: z.string().min(1, "Please choose a preferred deadline."),
  fulfillmentMethod: z.string().min(1, "Please select pickup or delivery."),
  projectDetails: z
    .string()
    .min(10, "Please share a few details about your project.")
    .max(2000, "Please keep the project details under 2000 characters."),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
