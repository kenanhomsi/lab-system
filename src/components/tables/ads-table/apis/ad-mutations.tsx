"use client";

import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { adModuleNames, AdFrontendService } from "@/modules/ad";
import type { CreateAdRequest, UpdateAdRequest } from "../types";
import { useMirrorRegistry } from "../store";

/**
 * Registers create, update, and delete mutations for ads.
 */
const AdMutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const adService = frontendContainer.get<AdFrontendService>(adModuleNames.service);

  const invalidateAds = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
  };

  const createAdMutation = useManagedMutation({
    mutationFn: async (payload: CreateAdRequest) =>
      adService.create({
        name: payload.name,
        description: payload.description,
        mediaType: payload.mediaType,
        media: payload.media,
        addressName: payload.addressName,
      }),
    onSuccess: invalidateAds,
  });

  const updateAdMutation = useManagedMutation({
    mutationFn: async (payload: UpdateAdRequest) =>
      adService.update({
        id: payload.id,
        name: payload.name,
        description: payload.description,
        mediaType: payload.mediaType,
        media: payload.media,
        addressName: payload.addressName,
      }),
    onSuccess: invalidateAds,
  });

  const deleteAdMutation = useManagedMutation({
    mutationFn: async (id: number) => {
      await adService.delete({ id });
    },
    onSuccess: invalidateAds,
  });

  useMirrorRegistry("createAd", async (payload: CreateAdRequest) =>
    createAdMutation.mutateAsync(payload),
  );
  useMirrorRegistry("updateAd", async (payload: UpdateAdRequest) =>
    updateAdMutation.mutateAsync(payload),
  );
  useMirrorRegistry("deleteAd", async (id: number) => deleteAdMutation.mutateAsync(id));

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { AdMutations };
