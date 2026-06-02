"use client";

import { storeService } from "@/components/features/store";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const Mutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["store", "admin", "banners"] });
  };

  const createMutation = useManagedMutation({
    mutationFn: (data: UpsertStoreBannerInput) => storeService.createBanner(data),
    onSuccess: invalidate,
  });

  const updateMutation = useManagedMutation({
    mutationFn: (params: { id: number; data: UpsertStoreBannerInput }) =>
      storeService.updateBanner({ id: params.id, ...params.data }),
    onSuccess: invalidate,
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", { mutateAsync: updateMutation.mutateAsync });

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Mutations };
