"use client";

import { useComputedColorScheme } from "@mantine/core";
import { useEffect } from "react";

/**
 * Keeps <html class="dark"> in sync with Mantine's computed color scheme
 * so Tailwind dark: utilities and our CSS variable overrides work correctly.
 */
export function ThemeSync() {
  const computed = useComputedColorScheme("light");

  useEffect(() => {
    const html = document.documentElement;
    if (computed === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [computed]);

  return null;
}
