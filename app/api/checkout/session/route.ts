import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/backend/schemas";
import { dispatchOrderReceivedNotifications } from "@/lib/backend/notifications";
import { persistOrderDraft, recordOperationalWarning } from "@/lib/backend/repository";
import { buildOrderSnapshot, persistOrderSnapshot } from "@/lib/orders";
import { env } from "@/lib/env";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError, logInfo } from "@/lib/logger";
import { createCheckoutSession } from "@/lib/stripe";
import { CheckoutPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `checkout:${ip}`, limit: 20, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many checkout attempts. Please wait a moment and try again." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = checkoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please check your checkout details and try again." }, { status: 400 });
    }

    if (parsed.data.paymentMode === "deposit") {
      return NextResponse.json({ message: "Deposit checkout is not enabled yet. Please use secure online payment for now." }, { status: 400 });
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

    const persistence = await persistOrderDraft({
      payload: parsed.data as CheckoutPayload,
      order,
      paymentMode: parsed.data.paymentMode,
      stripeSessionId: "sessionId" in session ? session.sessionId : undefined,
      requestMeta: {
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        referer: request.headers.get("referer") ?? undefined,
      },
    });

    if (!persistence.persisted) {
      await recordOperationalWarning("Order draft could not be persisted to the primary repository.", {
        orderNumber: order.orderNumber,
      });
    }

    const notificationResult = await dispatchOrderReceivedNotifications({
      order,
      payload: parsed.data as CheckoutPayload,
      demo: session.status === "demo",
    });

    logInfo("Checkout session created", {
      orderNumber: order.orderNumber,
      stripeStatus: session.status,
      itemCount: order.items.length,
      persisted: persistence.persisted,
      notificationSkipped: Boolean(notificationResult.skipped),
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
