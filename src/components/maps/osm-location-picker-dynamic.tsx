"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { OsmLocationPickerProps } from "./osm-location-picker";

function MapLoading() {
  const t = useTranslations("common");
  return (
    <div
      className="flex min-h-[280px] w-full items-center justify-center rounded-xl bg-surface-container text-sm text-on-surface-variant"
      dir="auto"
    >
      {t("mapLoading")}
    </div>
  );
}

const OsmLocationPicker = dynamic(() => import("./osm-location-picker"), {
  ssr: false,
  loading: MapLoading,
});

export function OsmLocationPickerDynamic(props: OsmLocationPickerProps) {
  return (
    <div className="h-[min(20rem,44vh)] min-h-[280px] w-full overflow-hidden rounded-xl border border-outline-variant/40">
      <OsmLocationPicker {...props} />
    </div>
  );
}

export type { LocationPickerValue, OsmLocationPickerProps } from "./osm-location-picker";
