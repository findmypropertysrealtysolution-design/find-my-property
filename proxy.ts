import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FMP_ROLE_COOKIE, FMP_RT_COOKIE } from "@/lib/fmp-cookie";

function hasReferenceToken(request: NextRequest): boolean {
  const v = request.cookies.get(FMP_RT_COOKIE)?.value;
  return Boolean(v && v.trim().length > 0);
}

/** Paths that do not require `fmp-rt` (marketing, auth, property detail, logout). */
function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/sitemap") return true;
  if (pathname === "/logout" || pathname.startsWith("/logout/")) return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/register")) return true;
  if (pathname.startsWith("/onboarding")) return true;
  if (pathname.startsWith("/verify-agent")) return true;
  if (pathname.startsWith("/property/")) return true;
  return false;
}

/** Flat routes only admins may open */
const ADMIN_ONLY = new Set(["/approvals", "/agents", "/analytics", "/properties"]);

/** Agent + admin (not tenant) */
const AGENT_SCOPED = new Set(["/leads", "/reports"]);

/** Tenant-only */
const TENANT_SCOPED = new Set(["/alerts"]);

function pathMatchesSet(pathname: string, prefixes: Set<string>) {
  for (const p of prefixes) {
    if (pathname === p || pathname.startsWith(`${p}/`)) return true;
  }
  return false;
}

function role(request: NextRequest): string | undefined {
  return request.cookies.get(FMP_ROLE_COOKIE)?.value;
}

/**
 * Role guard using `fmp-role` cookie (set on login in `auth-context`).
 * Auth enforcement for API/data still happens server-side; this only steers navigation.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const r = role(request);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/onboarding")
  ) {
    return NextResponse.next();
  }

  if (!isPublicPath(pathname) && !hasReferenceToken(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/logout";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!r || !["admin", "agent", "tenant"].includes(r)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (pathMatchesSet(pathname, ADMIN_ONLY) && r !== "admin") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathMatchesSet(pathname, AGENT_SCOPED) && r === "tenant") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathMatchesSet(pathname, TENANT_SCOPED) && r !== "tenant") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if ((pathname.startsWith("/admin/") || pathname === "/admin") && r !== "admin") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if ((pathname.startsWith("/agent/") || pathname === "/agent") && r === "tenant") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if ((pathname.startsWith("/tenant/") || pathname === "/tenant") && r === "agent") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|woff2?)$).*)"],
};
