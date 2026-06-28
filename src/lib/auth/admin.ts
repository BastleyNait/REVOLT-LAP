import "server-only";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { env, isAdminAuthEnabled } from "@/lib/env";
import { ADMIN_COOKIE, computeAdminToken } from "@/lib/auth/token";

/** True when the submitted password matches (used by the login action). */
export function verifyPassword(input: string): boolean {
  return isAdminAuthEnabled && input === env.adminPassword;
}

/** Authorisation for server components / server actions (reads the cookie jar). */
export async function isAuthed(): Promise<boolean> {
  if (!isAdminAuthEnabled) return true; // no password configured => open (dev)
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return token === (await computeAdminToken(env.adminPassword));
}

/**
 * Authorisation for API route handlers. Accepts either the session cookie or an
 * `x-admin-password` header (handy for curl / serverless-to-serverless calls).
 */
export async function isRequestAuthorized(req: NextRequest): Promise<boolean> {
  if (!isAdminAuthEnabled) return true;
  const header = req.headers.get("x-admin-password");
  if (header && header === env.adminPassword) return true;
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return Boolean(token) && token === (await computeAdminToken(env.adminPassword));
}
