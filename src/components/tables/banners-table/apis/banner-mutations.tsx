"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreateBannerRequest } from "../types";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";

const BannerMutations = ({ children }: PropsWithChildren) => {
    const queryClient = useQueryClient();
    const bannerService = frontendContainer.get<BannerFrontendService>(bannerModuleNames.service);

    const createBannerMutation = useMutation({
        mutationFn: async (payload: CreateBannerRequest) => {
            return bannerService.create({
                title: payload.title,
                type: payload.type,
                InternalLink: payload.internalLink,
                ExternalLink: payload.externalLink,
                TargetType: payload.targetType,
                Location: payload.location,
                DisplayOrder: payload.displayOrder,
                startDate: payload.startDate,
                endDate: payload.endDate,
                isActive: payload.isActive,
                VisibilityRulesJson: payload.visibilityRulesJson,
                Media: payload.media,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        },
    });

    useMirrorRegistry("createBanner", async (payload: CreateBannerRequest) =>
        createBannerMutation.mutateAsync(payload),
    );

    const deleteBannerMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/banners/${id}`, {
                method: "DELETE",
                credentials: "same-origin",
            });
            if (!res.ok) {
                throw new Error("Failed to delete banner");
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        },
    });

    useMirrorRegistry("deleteBanner", async (id: string) =>
        deleteBannerMutation.mutateAsync(id),
    );
    return <>{children}</>;
};

export { BannerMutations };
