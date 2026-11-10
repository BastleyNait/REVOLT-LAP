import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isRequestAuthorized } from "@/lib/auth/admin";
import { reviewsEnabled, upsertInvite } from "@/lib/repositories/reviews";
import { siteConfig } from "@/lib/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  orderCode: z.string().trim().min(3).max(40),
  customerName: z.string().trim().min(1).max(120),
  laptop: z.string().trim().max(160).default(""),
  city: z.string().trim().max(120).default(""),
});

/**
 * POST /api/reviews/invite (admin) → { url }
 * One-time review link for an order, printed as the QR of the thank-you
 * letter. Same order code → same link.
 */
export async function POST(request: NextRequest) {
  if (!(await isRequestAuthorized(request))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!reviewsEnabled) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  try {
    const token = await upsertInvite(parsed.data);
    // In production the request origin is the live domain the QR must point to.
    const origin = process.env.VERCEL_ENV === "production" ? siteConfig.url : request.nextUrl.origin;
    return NextResponse.json({ url: `${origin}/opinar/${token}` });
  } catch (error) {
    console.error("review invite", error);
    return NextResponse.json(
      { error: "No se pudo crear el enlace. ¿Ejecutaste supabase/reviews.sql en Supabase?" },
      { status: 500 },
    );
  }
}
