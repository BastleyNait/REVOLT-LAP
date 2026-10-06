import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/config/site";

export const alt = "REVOLT — Laptops reacondicionadas en Arequipa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card (WhatsApp, Facebook, X) for the home and generic pages. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-revolt.png"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#050907",
          backgroundImage:
            "radial-gradient(70% 80% at 0% 0%, rgba(18,180,128,0.35), transparent 70%), radial-gradient(60% 70% at 100% 100%, rgba(18,180,128,0.18), transparent 70%)",
          color: "#E8F2EC",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} height={88} width={346} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Laptops reacondicionadas en Arequipa
          </div>
          <div style={{ fontSize: 36, color: "#12B480", fontWeight: 700 }}>Todo funcional · Envíos a todo el Perú · Paga en soles o dólares</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9FB5A8" }}>
          WhatsApp {siteConfig.whatsapp.display}
        </div>
      </div>
    ),
    size,
  );
}
