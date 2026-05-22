import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendQuoteEmails } from "@/lib/sendgrid";
import { quoteRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
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

    return NextResponse.json({
      message: "Quote request submitted successfully.",
      emailStatus: emailResult,
      storageConfigured: Boolean(supabase),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not submit your request right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
