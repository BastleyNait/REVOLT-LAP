import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="glass max-w-lg rounded-3xl p-10 text-center">
        <p className="font-display text-[5rem] font-extrabold leading-none tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-3xl font-extrabold">Página no encontrada</h1>
        <p className="mt-4 text-on-surface-variant">
          Es posible que esta laptop ya se haya vendido o que la dirección esté mal escrita.
        </p>
        <Link href="/#laptops" className={buttonClasses({ variant: "primary", size: "lg", className: "mt-8 min-h-14" })}>
          Ver laptops <Icon name="arrow" />
        </Link>
      </div>
    </main>
  );
}
