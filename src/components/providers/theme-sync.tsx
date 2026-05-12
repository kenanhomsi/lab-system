"use client";

import { useComputedColorScheme } from "@mantine/core";
import { useEffect } from "react";

type ThemeSyncProps = {
  /**
   * Public and marketing pages stay in light mode only; the `html.dark` class is
   * never applied when this is false.
   */
  active: boolean;
};

/**
 * Keeps <html class="dark"> in sync with Mantine's computed color scheme on
 * dashboard routes so Tailwind `dark:` utilities and CSS variable overrides match.
 */
export function ThemeSync({ active }: ThemeSyncProps) {
  const computed = useComputedColorScheme("light");

  useEffect(() => {
    const html = document.documentElement;
    if (!active) {
      html.classList.remove("dark");
      return;
    }
    if (computed === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [computed, active]);

  return null;
}
