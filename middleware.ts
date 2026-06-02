import { NextResponse, type NextRequest } from "next/server";

function unauthorizedAdminResponse() {
  return new NextResponse("Admin authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PrintMe Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

function decodeBasicCredentials(header: string | null) {
  if (!header?.startsWith("Basic ")) return null;

  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return null;

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const adminEmailsConfigured = Boolean(process.env.ADMIN_USER_EMAILS?.trim());
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    (process.env.ADMIN_PORTAL_ENABLED !== "true" || !adminEmailsConfigured)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("admin", "disabled");
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminUsername = process.env.ADMIN_PORTAL_USERNAME?.trim();
    const adminPassword = process.env.ADMIN_PORTAL_PASSWORD?.trim();

    if (!adminUsername || !adminPassword) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("admin", "misconfigured");
      return NextResponse.redirect(url);
    }

    const credentials = decodeBasicCredentials(request.headers.get("authorization"));
    if (!credentials || credentials.username !== adminUsername || credentials.password !== adminPassword) {
      return unauthorizedAdminResponse();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
