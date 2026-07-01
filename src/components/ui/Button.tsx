import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "dark"
  | "danger"
  | "outline"
  | "glass";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none select-none cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary shadow-neo hover:shadow-neo-md hover:brightness-110",
  secondary: "bg-secondary text-on-secondary shadow-neo hover:shadow-neo-md hover:brightness-110",
  tertiary: "bg-tertiary text-on-tertiary shadow-neo hover:shadow-neo-md hover:brightness-110",
  accent: "bg-accent text-on-accent shadow-neo hover:shadow-neo-md hover:brightness-105",
  dark: "bg-on-background text-background shadow-neo hover:shadow-neo-md hover:opacity-90",
  danger: "bg-error text-on-error shadow-neo hover:shadow-neo-md hover:brightness-110",
  outline: "border border-outline-variant text-on-background hover:bg-surface-container/60 hover:border-primary/40",
  glass: "glass text-on-background hover:brightness-105",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl md:text-2xl",
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
