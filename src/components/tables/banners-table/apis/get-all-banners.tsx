"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { BannersResponse } from "../types";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";

const GetAllBanners = (props: PropsWithChildren) => {
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
            return {
                data: response.data || [],
                total: response.total || 0,
            };
        },
        refetchInterval: 1000 * 60,
    });

    useMirrorRegistry("bannersData", data?.data ?? []);
    useMirrorRegistry("isPending", isPending);
    useMirrorRegistry("refetchBanners", () => {
        void refetch();
    });

    return props;
};

export { GetAllBanners };
