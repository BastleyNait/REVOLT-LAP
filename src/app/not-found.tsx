import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-lg -rotate-1 border-thick border-on-background bg-surface-container-lowest p-10 text-center shadow-neo-lg">
        <p className="font-display-xl text-[80px] font-black leading-none text-secondary-container">404</p>
        <h1 className="mt-4 font-display-lg text-headline-lg-mobile font-black uppercase">
          Página no encontrada
        </h1>
        <p className="mt-4 font-body-lg text-body-md">
          Este equipo voló del inventario o la dirección está mal escrita.
        </p>
        <Link href="/" className={buttonClasses({ variant: "primary", size: "lg", className: "mt-8" })}>
          Volver al inventario
        </Link>
      </div>
    </main>
  );
}
