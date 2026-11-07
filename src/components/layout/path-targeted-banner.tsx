"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  buildPathTarget,
  isDetailPagePath,
  isPathTarget,
  normalizeTargetPath,
} from "@/lib/banners";
import type { BannerItem } from "@/types/banner";
import { PageBanner } from "./page-banner";

/**
 * Renders banners targeted at the current detail-page path (e.g. /tests/3).
 */
export function PathTargetedBanner() {
  const pathname = usePathname();
  const currentPath = useMemo(() => normalizeTargetPath(pathname), [pathname]);
  const pathTarget = useMemo(() => buildPathTarget(currentPath), [currentPath]);
  const enabled = isDetailPagePath(currentPath);
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const loadBanners = async () => {
      try {
        const response = await fetch("/api/website/banners", {
          cache: "force-cache",
        });
        if (!response.ok) return;

        const rows = (await response.json()) as BannerItem[];
        const matched = rows
          .filter(
            (item) =>
              item.isActive &&
              isPathTarget(item.location) &&
              item.location === pathTarget,
          )
          .sort((a, b) => a.displayOrder - b.displayOrder);

        if (!cancelled) setBanners(matched);
      } catch {
        if (!cancelled) setBanners([]);
      }
    };

    void loadBanners();

    return () => {
      cancelled = true;
    };
  }, [enabled, pathTarget]);

  if (!enabled || banners.length === 0) return null;
  return <PageBanner banners={banners} />;
}
