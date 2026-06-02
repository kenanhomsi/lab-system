"use client";

import { storeService } from "@/components/features/store";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import type { StoreOrderStatus } from "@/modules/store";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const Mutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["store", "admin", "orders"] });
  };

  const updateStatusMutation = useManagedMutation({
    mutationFn: (params: { id: number; status: StoreOrderStatus }) =>
      storeService.updateOrderStatus({ id: params.id, status: params.status }),
    onSuccess: invalidate,
  });

  useMirrorRegistry("updateStatusMutation", {
    mutateAsync: updateStatusMutation.mutateAsync,
    isPending: updateStatusMutation.isPending,
  });

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Mutations };
