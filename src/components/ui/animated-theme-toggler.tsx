"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { cn } from "@/lib/cn";

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "rectangle"
  | "hexagon"
  | "star";

interface AnimatedThemeTogglerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Duration of the theme transition animation in milliseconds */
  duration?: number;
  /** Shape used for the view-transition clip-path reveal */
  variant?: TransitionVariant;
  /** If true, the clip expands from the viewport center instead of the button */
  fromCenter?: boolean;
  /** If true, shows a text label next to the icon (for expanded sidebar rows) */
  showLabel?: boolean;
}

function getClipPath(
  variant: TransitionVariant,
  x: number,
  y: number,
  size: number,
): string {
  switch (variant) {
    case "circle":
      return `circle(${size}px at ${x}px ${y}px)`;
    case "square": {
      const half = size;
      return `polygon(${x - half}px ${y - half}px, ${x + half}px ${y - half}px, ${x + half}px ${y + half}px, ${x - half}px ${y + half}px)`;
    }
    case "triangle":
      return `polygon(${x}px ${y - size}px, ${x + size}px ${y + size}px, ${x - size}px ${y + size}px)`;
    case "diamond":
      return `polygon(${x}px ${y - size}px, ${x + size}px ${y}px, ${x}px ${y + size}px, ${x - size}px ${y}px)`;
    case "rectangle": {
      const w = size * 1.6;
      const h = size;
      return `polygon(${x - w}px ${y - h}px, ${x + w}px ${y - h}px, ${x + w}px ${y + h}px, ${x - w}px ${y + h}px)`;
    }
    case "hexagon": {
      const r = size;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return `${x + r * Math.cos(angle)}px ${y + r * Math.sin(angle)}px`;
      }).join(", ");
      return `polygon(${points})`;
    }
    case "star": {
      const outer = size;
      const inner = size * 0.4;
      const points = Array.from({ length: 10 }, (_, i) => {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? outer : inner;
        return `${x + r * Math.cos(angle)}px ${y + r * Math.sin(angle)}px`;
      }).join(", ");
      return `polygon(${points})`;
    }
    default:
      return `circle(${size}px at ${x}px ${y}px)`;
  }
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  variant = "circle",
  fromCenter = false,
  showLabel = false,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light");
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsDark(computed === "dark");
  }, [computed]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    let originX: number;
    let originY: number;

    if (fromCenter) {
      originX = viewportWidth / 2;
      originY = viewportHeight / 2;
    } else {
      const rect = button.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const maxRadius = Math.hypot(
      Math.max(originX, viewportWidth - originX),
      Math.max(originY, viewportHeight - originY),
    );

    const root = document.documentElement;

    root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
    root.style.setProperty("--magicui-theme-vt-clip-from", getClipPath(variant, originX, originY, 0));

    if (!document.startViewTransition) {
      flushSync(() => {
        const newDark = !isDark;
        setIsDark(newDark);
        setColorScheme(newDark ? "dark" : "light");
      });
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        const newDark = !isDark;
        setIsDark(newDark);
        setColorScheme(newDark ? "dark" : "light");
      });
    });

    transition.ready.then(() => {
      const clipFrom = getClipPath(variant, originX, originY, 0);
      const clipTo = getClipPath(variant, originX, originY, maxRadius);

      document.documentElement.animate(
        { clipPath: [clipFrom, clipTo] },
        {
          duration,
          easing: variant === "star" ? "linear" : "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });

    transition.finished.then(() => {
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    });
  }, [isDark, duration, variant, fromCenter, setColorScheme]);


  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      className={cn("p-2 rounded-full flex items-center justify-center mx-auto my-auto bg-surface-container-low hover:bg-surface-container-high transition-colors", className)}
      {...props}
    >
      {isDark ? <FiSun size={showLabel ? 17 : 16} aria-hidden /> : <FiMoon size={showLabel ? 17 : 16} aria-hidden />}

    </button>
  );
};
