import { NextResponse } from "next/server";
import { z } from "zod";
import { buildOrderSnapshot, persistOrderSnapshot } from "@/lib/orders";
import { env } from "@/lib/env";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError, logInfo } from "@/lib/logger";
import { createCheckoutSession } from "@/lib/stripe";
import { CheckoutPayload } from "@/types";

const cartItemSchema = z.object({
  id: z.string(),
  productSlug: z.string(),
  title: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  estimatedTotal: z.number().min(0),
  pricingMode: z.enum(["fixed-estimate", "starting-from", "quote-only"]),
  mode: z.enum(["direct-order", "quote-only", "hybrid"]),
  options: z.record(z.string(), z.string()),
  optionLabels: z.array(z.object({ label: z.string(), value: z.string() })),
  notes: z.string().optional(),
  fulfillmentMethod: z.string().optional(),
  turnaround: z.string().optional(),
  quoteOnly: z.boolean().optional(),
});

const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    companyName: z.string().optional(),
  }),
  fulfillmentMethod: z.enum(["pickup", "delivery"]),
  deliveryAddress: z
    .object({
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      province: z.string(),
      postalCode: z.string(),
    })
    .optional(),
  orderNotes: z.string().optional(),
  paymentMode: z.enum(["full", "deposit"]),
  items: z.array(cartItemSchema).min(1),
  subtotal: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `checkout:${ip}`, limit: 20, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many checkout attempts. Please wait a moment and try again." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please check your checkout details and try again." }, { status: 400 });
    }

    if (parsed.data.fulfillmentMethod === "delivery" && !parsed.data.deliveryAddress?.addressLine1) {
      return NextResponse.json({ message: "Please provide a delivery address." }, { status: 400 });
    }

    const order = buildOrderSnapshot(parsed.data as CheckoutPayload);
    await persistOrderSnapshot(order);

    const successUrl = `${env.siteUrl}/checkout/success?order=${encodeURIComponent(order.orderNumber)}`;
    const cancelUrl = `${env.siteUrl}/checkout/cancel?order=${encodeURIComponent(order.orderNumber)}`;

    const session = await createCheckoutSession({
      order,
      mode: parsed.data.paymentMode,
      successUrl,
      cancelUrl,
    });

    logInfo("Checkout session created", {
      orderNumber: order.orderNumber,
      stripeStatus: session.status,
      itemCount: order.items.length,
    });

    return NextResponse.json({
      order,
      checkoutUrl: session.url,
      stripeStatus: session.status,
    });
  } catch (error) {
    logError("Checkout session failed", error);

    return NextResponse.json(
      {
        message: "Unable to start checkout right now. Please review your cart or contact PrintMe for help.",
      },
      { status: 500 },
    );
  }
}
