"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env, isAdminAuthEnabled } from "@/lib/env";
import { ADMIN_COOKIE, computeAdminToken } from "@/lib/auth/token";

function sanitizeRedirect(target: string): string {
  return target.startsWith("/admin") ? target : "/admin";
}

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const redirectTo = sanitizeRedirect(String(formData.get("redirect") ?? "/admin"));

  if (!isAdminAuthEnabled || password !== env.adminPassword) {
    redirect(`/admin/login?error=1&redirect=${encodeURIComponent(redirectTo)}`);
  }

  (await cookies()).set(ADMIN_COOKIE, await computeAdminToken(env.adminPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  redirect(redirectTo);
}
