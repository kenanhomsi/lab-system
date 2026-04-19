"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreateBannerRequest, UpdateBannerRequest } from "../types";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";

const BannerMutations = (props: PropsWithChildren) => {
    const queryClient = useQueryClient();
    const bannerService = frontendContainer.get<BannerFrontendService>(bannerModuleNames.service);

    const createBannerMutation = useMutation({
        mutationFn: async (payload: CreateBannerRequest) => {
            return bannerService.create({
                title: payload.title,
                subtitle: payload.type,
                targetUrl: payload.externalLink || payload.internalLink,
                startDate: payload.startDate,
                endDate: payload.endDate,
                isActive: payload.isActive,
                imageFile: payload.media,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        },
    });

    const updateBannerMutation = useMutation({
        mutationFn: async (params: { id: string; payload: UpdateBannerRequest }) => {
            return bannerService.update({
                id: params.id,
                title: params.payload.title,
                subtitle: params.payload.type,
                targetUrl: params.payload.externalLink || params.payload.internalLink,
                startDate: params.payload.startDate,
                endDate: params.payload.endDate,
                isActive: params.payload.isActive,
                imageFile: params.payload.media,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        },
    });

    const deleteBannerMutation = useMutation({
        mutationFn: async (id: string) => {
            return bannerService.delete({ id });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        },
    });

    useMirrorRegistry("createBanner", async (payload: CreateBannerRequest) =>
        createBannerMutation.mutateAsync(payload),
    );
    useMirrorRegistry(
        "updateBanner",
        async (id: string, payload: UpdateBannerRequest) =>
            updateBannerMutation.mutateAsync({ id, payload }),
    );
    useMirrorRegistry("deleteBanner", async (id: string) =>
        deleteBannerMutation.mutateAsync(id),
    );

    return props;
};

export { BannerMutations };
