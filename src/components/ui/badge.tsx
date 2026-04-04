import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "default"
  | "success"
  | "warning"
  | "critical"
  | "muted"
  | "vip";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  default: "bg-secondary-container text-on-secondary-container",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  warning: "bg-tertiary-fixed text-on-tertiary-fixed",
  critical:
    "bg-tertiary-fixed text-on-tertiary-fixed [&_.material-symbols-outlined]:[font-variation-settings:'FILL'_1]",
  muted: "bg-surface-container-high text-on-surface-variant",
  vip: "bg-[#FFD700] text-slate-900",
};

export function Badge({
  children,
  tone = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
