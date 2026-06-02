"use client";

import { storeService } from "@/components/features/store";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const Mutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["store", "admin", "products"] });
  };

  const createMutation = useManagedMutation({
    mutationFn: (data: UpsertStoreProductInput) => storeService.createProduct(data),
    onSuccess: invalidate,
  });

  const updateMutation = useManagedMutation({
    mutationFn: (params: { id: number; data: UpsertStoreProductInput }) =>
      storeService.updateProduct({ id: params.id, ...params.data }),
    onSuccess: invalidate,
  });

  const deleteMutation = useManagedMutation({
    mutationFn: (id: number) => storeService.deleteProduct(id),
    onSuccess: invalidate,
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", { mutateAsync: updateMutation.mutateAsync });
  useMirrorRegistry("deleteMutation", { mutateAsync: deleteMutation.mutateAsync });

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Mutations };
