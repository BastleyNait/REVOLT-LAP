/**
 * Pure (env-free, runtime-agnostic) token helpers shared by the Edge middleware
 * and the Node server helpers. The admin "session" is just an opaque SHA-256 of
 * the configured password — enough to gate a single-operator dashboard without
 * pulling in a full auth provider.
 */

export const ADMIN_COOKIE = "revolt_admin";

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function computeAdminToken(password: string): Promise<string> {
  return sha256Hex(`revolt::admin::${password}`);
}
