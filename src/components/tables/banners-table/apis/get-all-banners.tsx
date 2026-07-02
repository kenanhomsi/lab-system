"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import type { BannerItem } from "@/types/banner";
import { normalizePublicBannerPayload } from "@/lib/banners/public-banner-payload";

const asBannerRows = (payload: unknown): BannerItem[] => {
  return normalizePublicBannerPayload(payload);
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
