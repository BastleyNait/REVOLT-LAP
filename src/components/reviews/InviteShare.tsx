"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

/** Mensaje listo para mandar el enlace de opinión por WhatsApp (elige el chat al abrirlo). */
export function inviteWhatsappUrl(url: string, customerName: string, laptop: string): string {
  const first = customerName.trim().split(/\s+/)[0] || "";
  const text = [
    `Hola${first ? ` ${first}` : ""}, gracias por confiar en ${siteConfig.name} 🙌`,
    `¿Nos ayudas con tu opinión${laptop ? ` sobre tu ${laptop}` : ""}? Toma 1 minuto y queda publicada como compra verificada:`,
    url,
  ].join("\n");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Copiar enlace + mandarlo por WhatsApp. */
export function InviteShare({ url, customerName, laptop, className }: { url: string; customerName: string; laptop: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copia el enlace:", url);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold hover:bg-white/10"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copiado" : "Copiar enlace"}
      </button>
      <a
        href={inviteWhatsappUrl(url, customerName, laptop)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-on-primary hover:brightness-110"
      >
        <WhatsappIcon className="text-base" /> Enviar por WhatsApp
      </a>
    </div>
  );
}
