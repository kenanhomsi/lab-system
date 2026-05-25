"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreateBannerRequest } from "../types";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";

const BannerMutations = ({ children }: PropsWithChildren) => {
    const queryClient = useQueryClient();
    const bannerService = frontendContainer.get<BannerFrontendService>(bannerModuleNames.service);

    const createBannerMutation = useManagedMutation({
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

    const deleteBannerMutation = useManagedMutation({
        mutationFn: async (id: string) => {
            await bannerService.delete({ id });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
        },
    });

    useMirrorRegistry("deleteBanner", async (id: string) =>
        deleteBannerMutation.mutateAsync(id),
    );
    return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { BannerMutations };
