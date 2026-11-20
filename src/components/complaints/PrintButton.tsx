"use client";

import { buttonClasses } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses({ variant: "primary", size: "md", className: "min-h-12" })}>
      Imprimir o guardar en PDF
    </button>
  );
}
