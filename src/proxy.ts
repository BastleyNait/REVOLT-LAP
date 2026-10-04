import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, computeAdminToken } from "@/lib/auth/token";

/**
 * Gate the /admin area. When ADMIN_PASSWORD is unset the dashboard is left open
 * (local dev convenience, with a visible warning in the UI). Otherwise an
 * invalid/absent session cookie is redirected to the login page.
 */
export async function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await computeAdminToken(password);
  if (token && token === expected) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
