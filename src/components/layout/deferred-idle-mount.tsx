"use client";

import { useEffect, useState, type ReactNode } from "react";

type DeferredIdleMountProps = {
  children: ReactNode;
  /** Fallback delay when requestIdleCallback is unavailable. */
  fallbackMs?: number;
};

/**
 * Mounts children after the browser is idle to avoid competing with LCP hydration.
 */
export function DeferredIdleMount({
  children,
  fallbackMs = 2500,
}: DeferredIdleMountProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setReady(true), { timeout: fallbackMs });
      return () => cancelIdleCallback(id);
    }

    const timer = window.setTimeout(() => setReady(true), fallbackMs);
    return () => window.clearTimeout(timer);
  }, [fallbackMs]);

  if (!ready) return null;

  return children;
}
