import { isAdminAuthEnabled, isSupabaseAdminConfigured, isR2Configured } from "@/lib/env";
import { Icon } from "@/components/ui/Icon";

/** Surface configuration gaps so the operator knows why writes/login behave oddly. */
export function AdminNotice() {
  if (isSupabaseAdminConfigured && isAdminAuthEnabled && isR2Configured) return null;

  return (
    <div className="space-y-3">
      {!isSupabaseAdminConfigured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-secondary/40 bg-secondary/15 p-4 text-on-background shadow-neo-sm">
          <Icon name="warning" className="text-2xl text-secondary" />
          <p className="text-sm font-medium leading-relaxed">
            Supabase no está configurado: las escrituras están deshabilitadas y se muestran datos de
            demo. Define <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
        </div>
      ) : null}
      {!isAdminAuthEnabled ? (
        <div className="flex items-start gap-3 rounded-2xl border border-tertiary/40 bg-tertiary/15 p-4 text-on-background shadow-neo-sm">
          <Icon name="lock_open" className="text-2xl text-tertiary" />
          <p className="text-sm font-medium leading-relaxed">
            Panel sin protección. Define <code>ADMIN_PASSWORD</code> para exigir inicio de sesión.
          </p>
        </div>
      ) : null}
      {!isR2Configured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/15 p-4 text-on-background shadow-neo-sm">
          <Icon name="cloud_off" className="text-2xl text-primary" />
          <p className="text-sm font-medium leading-relaxed">
            R2 no está configurado: no podrás subir imágenes al bucket. Define{" "}
            <code>R2_BUCKET</code>, <code>R2_ACCOUNT_ID</code>, <code>R2_ACCESS_KEY_ID</code>,{" "}
            <code>R2_SECRET_ACCESS_KEY</code> y <code>R2_PUBLIC_URL</code>. Las URLs externas
            seguirán funcionando.
          </p>
        </div>
      ) : null}
    </div>
  );
}
