"use client";

import { storeService } from "@/components/features/store";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const { data: productsData = [], isPending: isProductsPending } = useQuery({
    queryKey: ["store", "admin", "products", "all"],
    queryFn: async () => {
      const res = await storeService.listProducts({ query: { page: 1, pageSize: 500 } });
      return res.items;
    },
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["store", "admin", "sliders"] });
    await queryClient.invalidateQueries({ queryKey: ["store", "admin", "products"] });
  };

  const createMutation = useManagedMutation({
    mutationFn: (data: UpsertStoreSliderInput) => storeService.createSlider(data),
    onSuccess: invalidate,
  });

  const updateMutation = useManagedMutation({
    mutationFn: (params: { id: number; data: UpsertStoreSliderInput }) =>
      storeService.updateSlider({ id: params.id, ...params.data }),
    onSuccess: invalidate,
  });

  useMirrorRegistry("productsData", productsData);
  useMirrorRegistry("isProductsPending", isProductsPending);
  useMirrorRegistry("createSlider", createMutation.mutateAsync);
  useMirrorRegistry("updateSlider", updateMutation.mutateAsync);

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
