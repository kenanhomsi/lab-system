"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "@/i18n/navigation";
import {
  isDetailPagePath,
  normalizeTargetPath,
} from "@/lib/banners/page-target";

const PathTargetedBanner = dynamic(
  () =>
    import("./path-targeted-banner").then((m) => ({
      default: m.PathTargetedBanner,
    })),
  { ssr: false },
);

/**
 * Loads path-targeted banners only on detail/CMS pages — keeps DI + RQ off the homepage.
 */
export function PathTargetedBannerGate() {
  const pathname = usePathname();
  const isDetail = useMemo(
    () => isDetailPagePath(normalizeTargetPath(pathname)),
    [pathname],
  );

  if (!isDetail) return null;

  return <PathTargetedBanner />;
}
