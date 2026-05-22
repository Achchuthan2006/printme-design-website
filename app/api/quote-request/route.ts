import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendQuoteEmails } from "@/lib/sendgrid";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError, logInfo } from "@/lib/logger";
import { quoteRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `quote:${ip}`, limit: 8, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many quote requests. Please wait a moment and try again." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Please check your form input." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from("print_quote_requests").insert({
        full_name: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company_name: parsed.data.companyName || null,
        service_needed: parsed.data.serviceNeeded,
        quantity: parsed.data.quantity,
        preferred_deadline: parsed.data.preferredDeadline,
        fulfillment_method: parsed.data.fulfillmentMethod,
        project_details: parsed.data.projectDetails,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    const emailResult = await sendQuoteEmails(parsed.data);
    logInfo("Quote request received", {
      service: parsed.data.serviceNeeded,
      storageConfigured: Boolean(supabase),
      emailSkipped: Boolean(emailResult.skipped),
    });

    return NextResponse.json({
      message: "Quote request submitted successfully.",
      emailStatus: emailResult,
      storageConfigured: Boolean(supabase),
    });
  } catch (error) {
    logError("Quote request submission failed", error);

    return NextResponse.json(
      {
        message: "We could not submit your request right now. Please try again later or call PrintMe directly.",
      },
      { status: 500 },
    );
  }
}
