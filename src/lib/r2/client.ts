/**
 * Cloudflare R2 client (S3-compatible API).
 *
 * R2 exposes a fully S3-compatible endpoint at:
 *   https://{account_id}.r2.cloudflarestorage.com
 *
 * This module lazy-initialises a single S3Client instance so repeated calls
 * (e.g. multiple uploads in one request) reuse the same connection.
 */

import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

const R2_BUCKET = process.env.R2_BUCKET ?? "";
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";

/** Public-facing CDN URL for served images. */
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

/** True when all required R2 env vars are present. */
export const isR2Configured = Boolean(
  R2_BUCKET && R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_PUBLIC_URL,
);

function buildClient(): S3Client {
  return new S3Client({
    region: "auto", // R2 ignores the region but S3Client requires one
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export function getR2Client(): S3Client {
  if (!client) client = buildClient();
  return client;
}

export { R2_BUCKET };

/**
 * Build the public URL for an object key.
 * e.g. "products/abc123/laptop.jpg" → "https://cdn.example.com/products/abc123/laptop.jpg"
 */
export function r2ObjectUrl(key: string): string {
  return `${R2_PUBLIC_URL.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}
