"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import { adModuleNames, AdFrontendService } from "@/modules/ad";
import type { AdItem } from "@/types/ad";
import { useMirror, useMirrorRegistry } from "../store";

const normalizeAd = (value: unknown): AdItem | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<AdItem>;
  if (
    typeof item.id !== "number" ||
    typeof item.name !== "string" ||
    typeof item.description !== "string" ||
    (item.mediaType !== "Image" && item.mediaType !== "Video") ||
    typeof item.mediaUrl !== "string" ||
    typeof item.createdAt !== "string" ||
    (item.updatedAt !== null && typeof item.updatedAt !== "string")
  ) {
    return null;
  }
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    mediaType: item.mediaType,
    mediaUrl: item.mediaUrl,
    websiteUrl: typeof item.websiteUrl === "string" ? item.websiteUrl : undefined,
    latitude: typeof item.latitude === "number" ? item.latitude : undefined,
    longitude: typeof item.longitude === "number" ? item.longitude : undefined,
    addressName: typeof item.addressName === "string" ? item.addressName : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt ?? null,
  };
};

const asAdRows = (payload: unknown): AdItem[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeAd).filter((item): item is AdItem => item !== null);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) {
      return inner.map(normalizeAd).filter((item): item is AdItem => item !== null);
    }
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (Array.isArray(nested)) {
        return nested.map(normalizeAd).filter((item): item is AdItem => item !== null);
      }
    }
  }
  return [];
};

/**
 * Loads admin ads and mirrors them into the ads table store.
 */
const GetAllAds = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const adService = frontendContainer.get<AdFrontendService>(adModuleNames.service);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-ads", pageNumber],
    queryFn: async () =>
      adService.findAll({
        query: {
          Page: String(pageNumber),
          PageSize: "20",
        },
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("adsData", asAdRows(data));
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAds", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetAllAds, asAdRows };
