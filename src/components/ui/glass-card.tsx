import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl border border-white/40 shadow-2xl dark:border-white/10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
