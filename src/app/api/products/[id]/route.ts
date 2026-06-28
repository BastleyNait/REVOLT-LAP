import { NextResponse, type NextRequest } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/repositories/products";
import { productInputFromFormData, productInputSchema } from "@/lib/validators/product";
import { isRequestAuthorized } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function serverError(error: unknown) {
  return NextResponse.json({ error: (error as Error).message }, { status: 500 });
}

/** GET /api/products/:id  → single product, including inactive (auth required). */
export async function GET(request: NextRequest, { params }: RouteContext) {
  if (!(await isRequestAuthorized(request))) return unauthorized();
  const { id } = await params;
  try {
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: product });
  } catch (error) {
    return serverError(error);
  }
}

/** PUT /api/products/:id  → update (auth required). */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!(await isRequestAuthorized(request))) return unauthorized();
  const { id } = await params;

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
    const product = await updateProduct(id, parsed.data);
    return NextResponse.json({ data: product });
  } catch (error) {
    return serverError(error);
  }
}

/** DELETE /api/products/:id  → delete (auth required). */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!(await isRequestAuthorized(request))) return unauthorized();
  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    return serverError(error);
  }
}
