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
      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-neo-lg">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-2xl bg-primary/15 p-2.5 text-primary">
            <Icon name="lock" className="text-2xl" />
          </span>
          <h1 className="font-display-lg text-2xl font-black tracking-tight">Acceso admin</h1>
        </div>

        <form action={loginAction} className="space-y-6">
          <input type="hidden" name="redirect" value={redirectTo ?? "/admin"} />
          <Field label="Contraseña" htmlFor="password" required>
            <Input id="password" name="password" type="password" autoFocus required />
          </Field>

          {error ? (
            <p className="rounded-xl border border-error/40 bg-error/15 p-3 text-sm font-semibold text-error">
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
