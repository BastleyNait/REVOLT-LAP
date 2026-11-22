"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import { InviteShare } from "./InviteShare";

/** Link of an unused invite, again: copy, WhatsApp, and a QR on demand. */
export function PendingInviteLink({ url, qrSvg, customerName, laptop }: { url: string; qrSvg: string; customerName: string; laptop: string }) {
  const [showQr, setShowQr] = useState(false);
  return (
    <div className="mt-3 space-y-3">
      <a href={url} target="_blank" rel="noreferrer" className="block break-all text-sm font-semibold text-primary underline underline-offset-2">
        {url.replace(/^https?:\/\//, "")}
      </a>
      <div className="flex flex-wrap items-center gap-2">
        <InviteShare url={url} customerName={customerName} laptop={laptop} />
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold hover:bg-white/10"
        >
          <QrCode className="h-4 w-4" /> {showQr ? "Ocultar QR" : "Ver QR"}
        </button>
      </div>
      {showQr ? (
        <div
          aria-label="Código QR del enlace de opinión"
          className="h-44 w-44 rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
      ) : null}
    </div>
  );
}
