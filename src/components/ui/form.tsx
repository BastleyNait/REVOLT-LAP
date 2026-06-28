import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const controlBase =
  "w-full border-thin border-on-background bg-surface-container-lowest px-4 py-3 font-label-mono text-body-md text-on-background placeholder:text-on-surface-variant/50 focus:outline-none focus:border-thick focus:bg-primary-container/20 transition-colors";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(controlBase, className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(function Textarea(
  { className, rows = 4, ...props },
  ref,
) {
  return <textarea ref={ref} rows={rows} className={cn(controlBase, "resize-y", className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, ComponentProps<"select">>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select ref={ref} className={cn(controlBase, "appearance-none pr-10", className)} {...props}>
      {children}
    </select>
  );
});

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-2 block font-label-mono text-label-mono font-bold uppercase", className)}
    >
      {children}
      {required ? <span className="text-error"> *</span> : null}
    </label>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1 font-label-mono text-xs text-on-surface-variant">{children}</p>;
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 font-label-mono text-xs font-bold text-error">{children}</p>;
}

export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-6 w-6 border-thick border-on-background accent-secondary-container cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

/** Vertical label + control wrapper. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint ? <FieldHint>{hint}</FieldHint> : null}
      <FieldError>{error}</FieldError>
    </div>
  );
}
