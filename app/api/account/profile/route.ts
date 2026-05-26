import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/backend/auth";
import { syncCustomerProfile } from "@/lib/backend/account";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const profile = await syncCustomerProfile(auth.user, { role: auth.role });
    return NextResponse.json({
      profile,
      role: auth.role,
      isAdmin: auth.isAdmin,
    });
  } catch (error) {
    logError("Account profile lookup failed", error);
    return NextResponse.json({ message: "Unable to load account profile right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Partial<{
      fullName: string;
      phone: string;
      companyName: string;
    }>;

    const profile = await syncCustomerProfile(auth.user, {
      role: auth.role,
      fullName: body.fullName,
      phone: body.phone,
      companyName: body.companyName,
    });

    return NextResponse.json({
      profile,
      role: auth.role,
      isAdmin: auth.isAdmin,
    });
  } catch (error) {
    logError("Account profile sync failed", error);
    return NextResponse.json({ message: "Unable to sync account profile right now." }, { status: 500 });
  }
}
