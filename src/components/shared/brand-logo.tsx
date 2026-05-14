import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  label?: string;
  variant?: "icon" | "iconWithText" | "full";
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const iconSizeClassNames = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const fullLogoClassNames = {
  sm: "h-10 w-[150px]",
  md: "h-14 w-[200px]",
  lg: "h-16 w-[240px]",
} as const;

const labelClassNames = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
} as const;

/**
 * Renders the application logo using the assets stored in `public/LOGO`.
 */
export function BrandLogo({
  className,
  imageClassName,
  labelClassName,
  label,
  variant = "iconWithText",
  size = "md",
  priority = false,
}: BrandLogoProps) {
  if (variant === "full") {
    return (
      <div className={cn("relative shrink-0", fullLogoClassNames[size], className)}>
        <Image
          src="/LOGO/logo metwali app.png"
          alt={label ?? "Al Metwali Clinical Laboratory"}
          fill
          sizes="(max-width: 768px) 150px, 200px"
          className={cn("object-contain", imageClassName)}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative shrink-0", iconSizeClassNames[size])}>
        <Image
          src="/LOGO/logo metwali acon.png"
          alt={label ?? "Al Metwali Clinical Laboratory"}
          fill
          sizes="48px"
          className={cn("object-contain", imageClassName)}
          priority={priority}
        />
      </div>
      {variant === "iconWithText" && label ? (
        <span
          className={cn(
            "truncate font-headline font-extrabold tracking-tighter",
            labelClassNames[size],
            labelClassName,
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
