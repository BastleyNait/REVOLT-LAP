/**
 * R2 upload helpers — server-only utilities for putting image data into
 * the Cloudflare R2 bucket and returning public URLs.
 */

import "server-only";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getR2Client, R2_BUCKET, r2ObjectUrl, R2_PUBLIC_URL, isR2Configured } from "./client";
import { extname } from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * Upload a Buffer to R2 and return the public URL.
 *
 * @param data    — image bytes
 * @param key     — object key (e.g. "products/{productId}/{fileName}")
 * @param contentType — MIME type (auto-detected from extension if omitted)
 */
export async function uploadImage({
  data,
  key,
  contentType,
}: {
  data: Buffer;
  key: string;
  contentType?: string;
}): Promise<string> {
  if (!isR2Configured) {
    throw new Error(
      "R2 no está configurado. Define R2_BUCKET, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY y R2_PUBLIC_URL.",
    );
  }

  // Derive content type from extension if not provided
  if (!contentType) {
    const ext = extname(key).toLowerCase();
    const typeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".avif": "image/avif",
    };
    contentType = typeMap[ext] ?? "image/jpeg";
  }

  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: data,
      ContentType: contentType,
      // Browser cache: images rarely change, but we let the CDN handle cache-busting via URL
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return r2ObjectUrl(key);
}

/**
 * Delete an object from R2 by its public URL.
 * Useful when a product is deleted — clean up orphaned images.
 */
export async function deleteImageByPublicUrl(publicUrl: string): Promise<void> {
  if (!isR2Configured) return;

  const baseUrl = R2_PUBLIC_URL.replace(/\/+$/, "");
  const key = publicUrl.replace(new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?`), "");

  if (!key) return; // Not our URL

  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    }),
  );
}

/**
 * List all objects under a prefix (e.g. "products/{productId}/").
 * Returns an array of public URLs.
 */
export async function listImages(prefix: string): Promise<string[]> {
  if (!isR2Configured) return [];

  const client = getR2Client();
  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
    }),
  );

  return (response.Contents ?? []).map((obj) => r2ObjectUrl(obj.Key!));
}

/**
 * Validate that a file is an allowed image type and size.
 * Returns the MIME type or throws.
 */
export function validateImageFile(
  file: { name?: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> },
  index?: number,
): { name: string; type: string } {
  const idx = index ?? 0;
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(
      `Imagen ${idx + 1} no es válida. Solo JPEG, PNG, WebP, GIF y AVIF.`,
    );
  }

  return {
    name: file.name ?? `image-${idx}`,
    type: file.type,
  };
}

/**
 * Check file size limit (must be called after reading the buffer).
 */
export function checkFileSize(size: number, index?: number): void {
  const idx = index ?? 0;
  if (size > MAX_FILE_SIZE) {
    throw new Error(`Imagen ${idx + 1} excede los 10 MB.`);
  }
}
