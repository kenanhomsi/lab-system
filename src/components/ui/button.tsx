import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "clinical-gradient text-on-primary-container shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98]",
  secondary:
    "bg-surface-container-lowest text-primary border border-outline-variant/20 shadow-sm hover:bg-surface-container-low",
  tertiary: "bg-transparent text-primary font-semibold hover:underline",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-primary",
  outline:
    "border-2 border-primary text-primary font-bold hover:bg-primary/5",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-headline text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
