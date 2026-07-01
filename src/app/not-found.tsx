import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="glass max-w-lg rounded-3xl p-10 text-center shadow-neo-lg">
        <p className="font-display-xl text-[80px] font-black leading-none text-gradient">404</p>
        <h1 className="mt-4 font-display-lg text-3xl font-black tracking-tight">Página no encontrada</h1>
        <p className="mt-4 text-on-surface-variant">
          Este equipo voló del inventario o la dirección está mal escrita.
        </p>
        <Link href="/" className={buttonClasses({ variant: "primary", size: "lg", className: "mt-8" })}>
          Volver al inventario
        </Link>
      </div>
    </main>
  );
}
