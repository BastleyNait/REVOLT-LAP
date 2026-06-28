import { isAdminAuthEnabled, isSupabaseAdminConfigured } from "@/lib/env";
import { Icon } from "@/components/ui/Icon";

/** Surface configuration gaps so the operator knows why writes/login behave oddly. */
export function AdminNotice() {
  if (isSupabaseAdminConfigured && isAdminAuthEnabled) return null;

  return (
    <div className="space-y-3">
      {!isSupabaseAdminConfigured ? (
        <div className="flex items-start gap-3 border-thick border-on-background bg-secondary-container p-4 text-on-container shadow-neo">
          <Icon name="warning" className="text-2xl" />
          <p className="font-label-mono text-label-mono font-bold uppercase leading-relaxed">
            Supabase no está configurado: las escrituras están deshabilitadas y se muestran datos de
            demo. Define <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
        </div>
      ) : null}
      {!isAdminAuthEnabled ? (
        <div className="flex items-start gap-3 border-thick border-on-background bg-tertiary-container p-4 text-on-container shadow-neo">
          <Icon name="lock_open" className="text-2xl" />
          <p className="font-label-mono text-label-mono font-bold uppercase leading-relaxed">
            Panel sin protección. Define <code>ADMIN_PASSWORD</code> para exigir inicio de sesión.
          </p>
        </div>
      ) : null}
    </div>
  );
}
