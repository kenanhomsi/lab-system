"use client";

import dynamic from "next/dynamic";
import type { SlideCardItem } from "@/types/slide-card";

const SlideCardsSidebarContent = dynamic(
  () =>
    import("@/app/[locale]/(website)/ui/landing/slide-cards-section").then(
      (module) => module.SlideCardsSidebar,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        style={{
          minHeight: 280,
          borderRadius: 16,
          background: "var(--surface-variant, rgba(0,0,0,0.04))",
        }}
      />
    ),
  },
);

type Props = {
  initialCards?: SlideCardItem[];
};

/**
 * Dashboard offer sidebar loaded on demand to keep the home bundle lean.
 */
export function SlideCardsSidebar({ initialCards }: Props) {
  return <SlideCardsSidebarContent initialCards={initialCards} />;
}
