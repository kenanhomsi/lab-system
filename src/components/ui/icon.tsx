import { cn } from "@/lib/cn";

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: "sm" | "md" | "lg";
  "aria-hidden"?: boolean;
};

const sizeClass = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
} as const;

export function Icon({
  name,
  className,
  filled = false,
  size = "md",
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined inline-flex select-none",
        sizeClass[size],
        className,
      )}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
}
