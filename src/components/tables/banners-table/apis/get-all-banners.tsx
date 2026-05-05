"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import type { BannerItem } from "@/types/banner";

const asBannerRows = (payload: unknown): BannerItem[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner;
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (Array.isArray(nested)) return nested as BannerItem[];
    }
  }
  return [];
};

const GetAllBanners = ({ children }: PropsWithChildren) => {
    const pageNumber = useMirror("pageNumber");
    const bannerService = frontendContainer.get<BannerFrontendService>(bannerModuleNames.service);

    const { data, isPending, refetch } = useQuery({
        queryKey: ["admin-banners", pageNumber],
        queryFn: async () => {
            const response = await bannerService.findAll({
                query: {
                    Page: String(pageNumber),
                    PageSize: "20",
                },
            });
            return response
        },
        refetchInterval: 1000 * 60,
    });

    useMirrorRegistry("bannersData", asBannerRows(data));
    useMirrorRegistry("isPending", isPending);
    useMirrorRegistry("refetchBanners", () => {
        void refetch();
    });

    return <>{children}</>;
};

export { GetAllBanners };
