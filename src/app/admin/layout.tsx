import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "./actions";
import { isAdminAuthEnabled } from "@/lib/env";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/60 pb-6">
          <div>
            <Link
              href="/admin"
              className="font-display-lg text-2xl font-black uppercase tracking-tight text-gradient"
            >
              REVOLT · ADMIN
            </Link>
            <p className="text-sm text-on-surface-variant">Panel de inventario</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className={buttonClasses({ variant: "glass", size: "sm" })}>
              <Icon name="storefront" className="text-lg" /> Ver tienda
            </Link>
            {isAdminAuthEnabled ? (
              <form action={logoutAction}>
                <button type="submit" className={buttonClasses({ variant: "dark", size: "sm" })}>
                  <Icon name="logout" className="text-lg" /> Salir
                </button>
              </form>
            ) : null}
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
