import { NextResponse, type NextRequest } from "next/server";
import { createProduct, getAllProductsAdmin, getProducts } from "@/lib/repositories/products";
import { productInputFromFormData, productInputSchema } from "@/lib/validators/product";
import { isRequestAuthorized } from "@/lib/auth/admin";

// Runs as a Vercel serverless (Node) function — the service-role write path
// needs the Node runtime, not Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function serverError(error: unknown) {
  return NextResponse.json({ error: (error as Error).message }, { status: 500 });
}

/** GET /api/products  → active products. `?all=true` (auth) returns every row. */
export async function GET(request: NextRequest) {
  const includeAll = request.nextUrl.searchParams.get("all") === "true";
  try {
    if (includeAll) {
      if (!(await isRequestAuthorized(request))) return unauthorized();
      return NextResponse.json({ data: await getAllProductsAdmin() });
    }
    return NextResponse.json({ data: await getProducts() });
  } catch (error) {
    return serverError(error);
  }
}

/** POST /api/products  → create a product (auth required). JSON or form body. */
export async function POST(request: NextRequest) {
  if (!(await isRequestAuthorized(request))) return unauthorized();

  let raw: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    raw = contentType.includes("application/json")
      ? await request.json()
      : productInputFromFormData(await request.formData());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = productInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const product = await createProduct(parsed.data);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
