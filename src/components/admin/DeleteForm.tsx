"use client";

import { useFormStatus } from "react-dom";
import { buttonClasses } from "@/components/ui/Button";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses({ variant: "danger", size: "sm" })}>
      {pending ? "…" : "Borrar"}
    </button>
  );
}

export function DeleteForm({
  id,
  name,
  action,
}: {
  id: string;
  name: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}
