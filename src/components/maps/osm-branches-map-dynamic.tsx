"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { OsmBranchesMapProps } from "./osm-branches-map";

function MapLoading() {
  const t = useTranslations("common");
  return (
    <div
      className="flex min-h-[280px] w-full items-center justify-center bg-surface-container text-sm text-on-surface-variant"
      dir="auto"
    >
      {t("mapLoading")}
    </div>
  );
}

const OsmBranchesMap = dynamic(() => import("./osm-branches-map"), {
  ssr: false,
  loading: MapLoading,
});

export type OsmBranchesMapDynamicProps = OsmBranchesMapProps & {
  /**
   * arch — centered card with curved top (labs showcase).
   * fullBleed — edge-to-edge strip (legacy).
   */
  layout?: "arch" | "fullBleed";
};

export function OsmBranchesMapDynamic({
  layout = "arch",
  className,
  ...mapProps
}: OsmBranchesMapDynamicProps) {
  const mapClassName =
    className ?? "z-0 h-full min-h-[280px] w-full rounded-none";

  const mapInner = (
    <div className="h-[min(26rem,50vh)] min-h-[280px] w-full sm:h-[min(30rem,54vh)] sm:min-h-[320px]">
      <OsmBranchesMap {...mapProps} className={mapClassName} />
    </div>
  );

  if (layout === "arch") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="map-arch-frame bg-surface-container shadow-[0_28px_56px_-16px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/6">
          {mapInner}
        </div>
      </div>
    );
  }

  const shell = (
    <div className="w-full overflow-hidden border-y border-outline-variant/20 bg-surface-container shadow-sm">
      {mapInner}
    </div>
  );

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      {shell}
    </div>
  );
}
