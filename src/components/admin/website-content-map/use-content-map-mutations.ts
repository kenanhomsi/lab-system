"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { frontendContainer } from "@/container";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { adModuleNames, AdFrontendService } from "@/modules/ad";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import { PageFrontendService, pageModuleNames } from "@/modules/pages";
import {
  SlideCardFrontendService,
  slideCardModuleNames,
} from "@/modules/slide-card";
import {
  WelcomePageFrontendService,
  welcomePageModuleNames,
} from "@/modules/welcome-page";
import type { CreateAdRequest, UpdateAdRequest } from "@/types/ad";
import type {
  BannerItem,
  CreateBannerRequest,
  UpdateBannerRequest,
} from "@/types/banner";
import type { SlideCardItem, CreateSlideCardRequest } from "@/types/slide-card";
import type { PageUpsertRequest } from "@/types/website-page";
import type {
  CreateWelcomePageRequest,
  UpdateWelcomePageRequest,
} from "@/types/welcome-page";
import { normalizeDisplayMode } from "@/lib/banners/display-mode";
import { normalizeBannerPlacement, type BannerPlacement } from "@/lib/banners/locations";

const invalidateContentQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  pageId?: number,
) => {
  const keys = [
    ["admin-content-map-banners"],
    ["admin-content-map-ads"],
    ["admin-content-map-slide-cards"],
    ["admin-content-map-pages"],
    ["admin-banners"],
    ["admin-ads"],
    ["admin-slide-cards"],
    ["admin-website-pages"],
    ["admin-content-map-welcome-pages"],
    ["admin-welcome-pages"],
  ];
  await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })));
  if (pageId !== undefined) {
    await queryClient.invalidateQueries({
      queryKey: ["admin-content-map-page", pageId],
    });
  }
};

export const bannerToUpdateRequest = (
  banner: BannerItem,
  overrides: Partial<UpdateBannerRequest> = {},
): UpdateBannerRequest => ({
  id: banner.id,
  title: banner.title,
  type: banner.type,
  internalLink: banner.internalLink ?? "",
  externalLink: banner.externalLink ?? "",
  targetType: banner.targetType ?? "",
  location:
    normalizeBannerPlacement(banner.location) ??
    (banner.location as BannerPlacement),
  displayOrder: banner.displayOrder,
  isActive: banner.isActive,
  displayMode: normalizeDisplayMode(banner.displayMode),
  visibilityRulesJson: banner.visibilityRules ?? "",
  startDate: banner.startDate,
  endDate: banner.endDate,
  ...overrides,
});

/**
 * Shared mutations for the website content map and legacy admin tabs.
 */
export function useContentMapMutations() {
  const queryClient = useQueryClient();
  const bannerService = frontendContainer.get<BannerFrontendService>(
    bannerModuleNames.service,
  );
  const adService = frontendContainer.get<AdFrontendService>(adModuleNames.service);
  const slideCardService = frontendContainer.get<SlideCardFrontendService>(
    slideCardModuleNames.service,
  );
  const pageService = frontendContainer.get<PageFrontendService>(
    pageModuleNames.service,
  );
  const welcomePageService = frontendContainer.get<WelcomePageFrontendService>(
    welcomePageModuleNames.service,
  );

  const onMutateSuccess = useCallback(
    async (pageId?: number) => {
      await invalidateContentQueries(queryClient, pageId);
    },
    [queryClient],
  );

  const createBannerMutation = useManagedMutation({
    mutationFn: async (payload: CreateBannerRequest) =>
      bannerService.create({
        title: payload.title,
        type: payload.type,
        InternalLink: payload.internalLink,
        ExternalLink: payload.externalLink,
        TargetType: payload.targetType,
        Location: payload.location,
        DisplayOrder: payload.displayOrder,
        displayMode: payload.displayMode,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: payload.isActive,
        VisibilityRulesJson: payload.visibilityRulesJson,
        Media: payload.media,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const updateBannerMutation = useManagedMutation({
    mutationFn: async (payload: UpdateBannerRequest) =>
      bannerService.update({
        id: payload.id,
        title: payload.title,
        type: payload.type,
        InternalLink: payload.internalLink,
        ExternalLink: payload.externalLink,
        TargetType: payload.targetType,
        Location: payload.location,
        DisplayOrder: payload.displayOrder,
        displayMode: payload.displayMode,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: payload.isActive,
        VisibilityRulesJson: payload.visibilityRulesJson,
        Media: payload.media,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const deleteBannerMutation = useManagedMutation({
    mutationFn: async (id: string) => bannerService.delete({ id }),
    onSuccess: () => onMutateSuccess(),
  });

  const createAdMutation = useManagedMutation({
    mutationFn: async (payload: CreateAdRequest) =>
      adService.create({
        name: payload.name,
        description: payload.description,
        mediaType: payload.mediaType,
        addressName: payload.addressName,
        displayMode: payload.displayMode,
        media: payload.media,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const updateAdMutation = useManagedMutation({
    mutationFn: async (payload: UpdateAdRequest) =>
      adService.update({
        id: payload.id,
        name: payload.name,
        description: payload.description,
        mediaType: payload.mediaType,
        addressName: payload.addressName,
        displayMode: payload.displayMode,
        media: payload.media,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const deleteAdMutation = useManagedMutation({
    mutationFn: async (id: number) => adService.delete({ id }),
    onSuccess: () => onMutateSuccess(),
  });

  const createSlideCardMutation = useManagedMutation({
    mutationFn: async (payload: CreateSlideCardRequest) =>
      slideCardService.create({
        title: payload.title,
        description: payload.description,
        price: payload.price,
        discount: payload.discount,
        expiryDate: payload.expiryDate,
        badge: payload.badge,
        detailPageLink: payload.detailPageLink,
        displayOrder: payload.displayOrder,
        isActive: payload.isActive,
        image: payload.image,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const updateSlideCardMutation = useManagedMutation({
    mutationFn: async (payload: {
      id: number;
      title: string;
      description: string;
      price: number;
      discount: number;
      expiryDate: string;
      badge: string;
      detailPageLink: string;
      displayOrder: number;
      isActive: boolean;
      image?: File;
    }) =>
      slideCardService.update({
        id: payload.id,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        discount: payload.discount,
        expiryDate: payload.expiryDate,
        badge: payload.badge,
        detailPageLink: payload.detailPageLink,
        displayOrder: payload.displayOrder,
        isActive: payload.isActive,
        image: payload.image,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const deleteSlideCardMutation = useManagedMutation({
    mutationFn: async (id: number) => slideCardService.delete({ id }),
    onSuccess: () => onMutateSuccess(),
  });

  const updatePageMutation = useManagedMutation({
    mutationFn: async (payload: PageUpsertRequest & { id: number }) =>
      pageService.update(payload),
    onSuccess: (_data, variables) => onMutateSuccess(variables.id),
  });

  const createWelcomePageMutation = useManagedMutation({
    mutationFn: async (payload: CreateWelcomePageRequest) =>
      welcomePageService.create({
        name: payload.name,
        description: payload.description,
        mediaType: payload.mediaType,
        media: payload.media,
        isActive: payload.isActive,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const updateWelcomePageMutation = useManagedMutation({
    mutationFn: async (payload: UpdateWelcomePageRequest) =>
      welcomePageService.update({
        id: payload.id,
        name: payload.name,
        description: payload.description,
        mediaType: payload.mediaType,
        media: payload.media,
        isActive: payload.isActive,
      }),
    onSuccess: () => onMutateSuccess(),
  });

  const deleteWelcomePageMutation = useManagedMutation({
    mutationFn: async (id: number) => welcomePageService.delete({ id }),
    onSuccess: () => onMutateSuccess(),
  });

  const moveBannerToSlot = useCallback(
    async (banner: BannerItem, location: BannerPlacement, displayOrder: number) => {
      await updateBannerMutation.mutateAsync(
        bannerToUpdateRequest(banner, { location, displayOrder }),
      );
    },
    [updateBannerMutation],
  );

  const swapBannerDisplayOrder = useCallback(
    async (left: BannerItem, right: BannerItem) => {
      await updateBannerMutation.mutateAsync(
        bannerToUpdateRequest(left, { displayOrder: right.displayOrder }),
      );
      await updateBannerMutation.mutateAsync(
        bannerToUpdateRequest(right, { displayOrder: left.displayOrder }),
      );
    },
    [updateBannerMutation],
  );

  const swapSlideCardDisplayOrder = useCallback(
    async (left: SlideCardItem, right: SlideCardItem) => {
      await updateSlideCardMutation.mutateAsync({
        id: left.id,
        title: left.title,
        description: left.description,
        price: left.price,
        discount: left.discount,
        expiryDate: left.expiryDate,
        badge: left.badge,
        detailPageLink: left.detailPageLink,
        displayOrder: right.displayOrder,
        isActive: left.isActive,
      });
      await updateSlideCardMutation.mutateAsync({
        id: right.id,
        title: right.title,
        description: right.description,
        price: right.price,
        discount: right.discount,
        expiryDate: right.expiryDate,
        badge: right.badge,
        detailPageLink: right.detailPageLink,
        displayOrder: left.displayOrder,
        isActive: right.isActive,
      });
    },
    [updateSlideCardMutation],
  );

  return useMemo(
    () => ({
      createBanner: createBannerMutation.mutateAsync,
      updateBanner: updateBannerMutation.mutateAsync,
      deleteBanner: deleteBannerMutation.mutateAsync,
      createAd: createAdMutation.mutateAsync,
      updateAd: updateAdMutation.mutateAsync,
      deleteAd: deleteAdMutation.mutateAsync,
      createSlideCard: createSlideCardMutation.mutateAsync,
      updateSlideCard: updateSlideCardMutation.mutateAsync,
      deleteSlideCard: deleteSlideCardMutation.mutateAsync,
      updatePage: updatePageMutation.mutateAsync,
      createWelcomePage: createWelcomePageMutation.mutateAsync,
      updateWelcomePage: updateWelcomePageMutation.mutateAsync,
      deleteWelcomePage: deleteWelcomePageMutation.mutateAsync,
      moveBannerToSlot,
      swapBannerDisplayOrder,
      swapSlideCardDisplayOrder,
      isPending:
        createBannerMutation.isPending ||
        updateBannerMutation.isPending ||
        deleteBannerMutation.isPending ||
        createAdMutation.isPending ||
        updateAdMutation.isPending ||
        deleteAdMutation.isPending ||
        createSlideCardMutation.isPending ||
        updateSlideCardMutation.isPending ||
        deleteSlideCardMutation.isPending ||
        updatePageMutation.isPending,
    }),
    [
      createBannerMutation,
      updateBannerMutation,
      deleteBannerMutation,
      createAdMutation,
      updateAdMutation,
      deleteAdMutation,
      createSlideCardMutation,
      updateSlideCardMutation,
      deleteSlideCardMutation,
      updatePageMutation,
      createWelcomePageMutation,
      updateWelcomePageMutation,
      deleteWelcomePageMutation,
      moveBannerToSlot,
      swapBannerDisplayOrder,
      swapSlideCardDisplayOrder,
    ],
  );
}
