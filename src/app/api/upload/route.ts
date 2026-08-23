/**
 * POST /api/upload
 *
 * Serverless endpoint for uploading product images to Cloudflare R2.
 * Accepts multipart form data with one or more files in the "images" field.
 *
 * Auth: requires x-admin-password header or admin session cookie.
 *
 * Response: { urls: string[] } — array of public R2 URLs
 */

import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/auth/admin";
import { uploadImage, validateImageFile, checkFileSize } from "@/lib/r2/upload";
import { isR2Configured } from "@/lib/r2/client";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Maximum number of images per request. */
const MAX_IMAGES = 10;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!(await isRequestAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isR2Configured) {
    return NextResponse.json(
      { error: "R2 no está configurado. Define las variables R2_* en tu entorno." },
      { status: 503 },
    );
  }

  // Parse multipart form data
  const formData = await request.formData();
  const files = formData.getAll("images");

  if (!files.length) {
    return badRequest("No se recibieron imágenes. Usa el campo 'images' en el FormData.");
  }

  if (files.length > MAX_IMAGES) {
    return badRequest(`Máximo ${MAX_IMAGES} imágenes por petición.`);
  }

  const urls: string[] = [];
  const uploadId = randomUUID().slice(0, 8);

  for (let i = 0; i < files.length; i++) {
    const file = files[i] as File;

    // Validate type
    const { name, type } = validateImageFile(file, i);

    // Read buffer and check size
    const buffer = Buffer.from(await file.arrayBuffer());
    checkFileSize(buffer.length, i);

    // Build key: products/{uploadId}/{timestamp}-{originalName}
    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `products/${uploadId}/${timestamp}-${safeName}`;

    const url = await uploadImage({ data: buffer, key, contentType: type });
    urls.push(url);
  }

  return NextResponse.json({ urls }, { status: 201 });
}
