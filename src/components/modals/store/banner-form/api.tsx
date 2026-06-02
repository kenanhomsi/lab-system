"use client";

import { storeService } from "@/components/features/store";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["store", "admin", "categories"],
    queryFn: () => storeService.listCategories(),
  });

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

  useMirrorRegistry("categories", categories);
  useMirrorRegistry("createBanner", createMutation.mutateAsync);
  useMirrorRegistry("updateBanner", updateMutation.mutateAsync);

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
