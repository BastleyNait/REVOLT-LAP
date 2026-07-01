import { isAdminAuthEnabled, isSupabaseAdminConfigured } from "@/lib/env";
import { Icon } from "@/components/ui/Icon";

/** Surface configuration gaps so the operator knows why writes/login behave oddly. */
export function AdminNotice() {
  if (isSupabaseAdminConfigured && isAdminAuthEnabled) return null;

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
    </div>
  );
}
