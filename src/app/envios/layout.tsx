import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { absolute: "REVOLT Envíos" },
  description: "Etiquetas, guía de envío, carta de agradecimiento y garantía en un PDF.",
  robots: { index: false, follow: false },
  manifest: "/envios.webmanifest",
  appleWebApp: { capable: true, title: "Envíos", statusBarStyle: "black-translucent" },
  icons: { apple: "/envios-icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#010201",
};

export default function EnviosLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin-plain relative flex-1">{children}</main>;
}
