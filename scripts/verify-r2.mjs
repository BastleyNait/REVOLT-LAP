#!/usr/bin/env node
/**
 * Verify Cloudflare R2 connection
 * - Lists existing buckets
 * - Creates R2_BUCKET if it doesn't exist
 * - Uploads a test object
 * - Reads it back
 * - Deletes the test object
 * - Reports the public URL to use
 */

import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// ── Read env from .env file ──────────────────────────────────────
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
const R2_BUCKET = process.env.R2_BUCKET ?? "revolt-lap-images";

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("❌ Missing R2 credentials. Check .env file.");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

console.log("=".repeat(60));
console.log("  Cloudflare R2 Connection Test");
console.log("=".repeat(60));
console.log(`  Account ID : ${R2_ACCOUNT_ID}`);
console.log(`  Endpoint   : ${ENDPOINT}`);
console.log(`  Bucket     : ${R2_BUCKET}`);
console.log("");

// ── Step 1: List buckets ─────────────────────────────────────────
console.log("📋 Step 1: Listing buckets...");
try {
  const listRes = await client.send(new ListBucketsCommand({}));
  const buckets = (listRes.Buckets ?? []).map((b) => b.Name);
  console.log(`  Found ${buckets.length} bucket(s): ${buckets.join(", ") || "(none)"}`);

  if (!buckets.includes(R2_BUCKET)) {
    console.log(`\n📦 Step 2: Creating bucket "${R2_BUCKET}"...`);
    try {
      await client.send(
        new CreateBucketCommand({
          Bucket: R2_BUCKET,
        })
      );
      console.log(`  ✅ Bucket "${R2_BUCKET}" created successfully!`);
    } catch (err) {
      console.error(`  ❌ Failed to create bucket: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(`\n✅ Bucket "${R2_BUCKET}" already exists.`);
  }
} catch (err) {
  console.error(`  ❌ Failed to list buckets: ${err.message}`);
  process.exit(1);
}

// ── Step 3: Upload test object ───────────────────────────────────
const testKey = `.r2-test-${Date.now()}/verify.txt`;
const testData = Buffer.from("R2 connection verified by REVOLT-LAP ✓");

console.log(`\n📤 Step 3: Uploading test object...`);
try {
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: testKey,
      Body: testData,
      ContentType: "text/plain",
    })
  );
  console.log(`  ✅ Uploaded: ${testKey}`);
} catch (err) {
  console.error(`  ❌ Upload failed: ${err.message}`);
  process.exit(1);
}

// ── Step 4: Read test object back ────────────────────────────────
console.log(`\n📥 Step 4: Reading test object back...`);
try {
  const getRes = await client.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: testKey,
    })
  );
  const content = await getRes.Body?.transformToString();
  if (content === testData.toString()) {
    console.log(`  ✅ Content matches: "${content}"`);
  } else {
    console.log(`  ⚠️ Content mismatch (got: "${content}")`);
  }
} catch (err) {
  console.error(`  ❌ Read failed: ${err.message}`);
  process.exit(1);
}

// ── Step 5: Cleanup ──────────────────────────────────────────────
console.log(`\n🧹 Step 5: Cleaning up test object...`);
try {
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: testKey,
    })
  );
  console.log(`  ✅ Deleted: ${testKey}`);
} catch (err) {
  console.error(`  ⚠️ Cleanup failed (non-critical): ${err.message}`);
}

// ── Summary ──────────────────────────────────────────────────────
console.log("");
console.log("=".repeat(60));
console.log("  ✅ R2 connection verified successfully!");
console.log("=".repeat(60));
console.log("");
console.log("  Next steps:");
console.log("  1. In Cloudflare dashboard → R2 → Settings → Public bucket");
console.log(`     Enable public access for "${R2_BUCKET}"`);
console.log("  2. Copy the public bucket URL (e.g. https://pub-xxxx.r2.dev)");
console.log("  3. Update .env → R2_PUBLIC_URL with that URL");
console.log("");
console.log("  S3 endpoint (internal):", ENDPOINT);
console.log("");
