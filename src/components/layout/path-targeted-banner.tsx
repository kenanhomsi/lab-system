"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "@/i18n/navigation";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
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

  const bannerService = frontendContainer.get<BannerFrontendService>(
    bannerModuleNames.service,
  );

  const { data: banners = [] } = useQuery({
    queryKey: ["path-targeted-banners", pathTarget],
    enabled,
    queryFn: async (): Promise<BannerItem[]> => {
      const rows = await bannerService.findAllPublic({ location: pathTarget });
      return rows
        .filter((item) => item.isActive && isPathTarget(item.location))
        .sort((a, b) => a.displayOrder - b.displayOrder);
    },
    staleTime: 60_000,
  });

  if (!enabled || banners.length === 0) return null;
  return <PageBanner banners={banners} />;
}
