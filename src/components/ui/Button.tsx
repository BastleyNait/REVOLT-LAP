import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "dark"
  | "danger"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-2 border-thick border-on-background font-label-mono font-bold uppercase tracking-wide leading-none transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-container text-on-container hover:bg-primary-fixed-dim",
  secondary: "bg-secondary-container text-on-container hover:bg-secondary-fixed-dim",
  tertiary: "bg-tertiary-container text-on-container hover:bg-tertiary-fixed-dim",
  accent: "bg-accent text-on-accent hover:bg-accent-dim",
  dark: "bg-on-background text-surface hover:bg-inverse-surface",
  danger: "bg-error text-on-error hover:bg-on-error-container",
  outline: "bg-surface-container-lowest text-on-background hover:bg-surface-container",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-label-mono shadow-neo-xs hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-sm active:translate-x-1 active:translate-y-1 active:shadow-none",
  md: "px-6 py-3 text-body-md shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-none",
  lg: "px-8 py-4 text-body-lg shadow-neo-md hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg active:translate-x-1.5 active:translate-y-1.5 active:shadow-none",
  xl: "px-8 py-7 text-2xl md:text-3xl shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-xl active:translate-x-2 active:translate-y-2 active:shadow-none",
};

interface StyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Shared class builder so links can be styled identically to buttons. */
export function buttonClasses({ variant = "primary", size = "md", className }: StyleOptions = {}): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleOptions {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses({ variant, size, className })} {...props} />;
});
