"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { SparkleNavbarProps } from "./sparkle-navbar";

const SparkleNavbar = dynamic(
  () => import("./sparkle-navbar").then((module) => module.SparkleNavbar),
  {
    ssr: false,
    loading: () => <SparkleNavbarFallback />,
  },
);

function SparkleNavbarFallback() {
  return (
    <nav
      aria-hidden="true"
      className="flex min-h-10 items-center gap-2 opacity-60"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <span
          key={index}
          className="inline-block h-3 rounded-full bg-current/15"
          style={{ width: `${48 + index * 8}px` }}
        />
      ))}
    </nav>
  );
}

/**
 * Defers GSAP navbar until the browser is idle to reduce homepage TBT.
 */
export function LazySparkleNavbar(props: SparkleNavbarProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setReady(true), { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }

    const timer = window.setTimeout(() => setReady(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) {
    return <SparkleNavbarFallback />;
  }

  return <SparkleNavbar {...props} />;
}
