"use client";

import dynamic from "next/dynamic";

const ScrollRevealObserver = dynamic(
  () =>
    import("@/components/layout/scroll-reveal-observer").then((m) => ({
      default: m.ScrollRevealObserver,
    })),
  { ssr: false },
);

export function DeferredScrollRevealObserver() {
  return <ScrollRevealObserver />;
}
