import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/backend/auth";
import { getCustomerDashboardData } from "@/lib/backend/account";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const dashboard = await getCustomerDashboardData(auth.user);
    return NextResponse.json(dashboard);
  } catch (error) {
    logError("Account dashboard lookup failed", error);
    return NextResponse.json({ message: "Unable to load dashboard data right now." }, { status: 500 });
  }
}
