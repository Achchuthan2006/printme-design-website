import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") && process.env.ADMIN_PORTAL_ENABLED !== "true") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("admin", "disabled");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
