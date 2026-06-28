import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { isAdminAuthEnabled } from "@/lib/env";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Admin · Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  // When no password is configured the area is open; skip the login screen.
  if (!isAdminAuthEnabled) redirect("/admin");

  const { error, redirect: redirectTo } = await searchParams;

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-md -rotate-1 border-thick border-on-background bg-surface-container-lowest p-8 shadow-neo-lg">
        <div className="mb-6 flex items-center gap-2">
          <span className="border-thick border-on-background bg-primary-container p-2 shadow-neo-xs">
            <Icon name="lock" className="text-2xl" />
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile font-black uppercase">Acceso admin</h1>
        </div>

        <form action={loginAction} className="space-y-6">
          <input type="hidden" name="redirect" value={redirectTo ?? "/admin"} />
          <Field label="Contraseña" htmlFor="password" required>
            <Input id="password" name="password" type="password" autoFocus required />
          </Field>

          {error ? (
            <p className="border-thin border-error bg-error-container p-2 font-label-mono text-label-mono font-bold text-on-error-container">
              Contraseña incorrecta.
            </p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
