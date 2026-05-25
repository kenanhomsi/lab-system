"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import {
  subscriptionPackageModuleNames,
  SubscriptionPackageFrontendService,
} from "@/modules/subscription-package";
import { useMirrorRegistry } from "../store";
import {
  CreateSubscriptionPackageRequest,
  UpdateSubscriptionPackageRequest,
} from "../types";

const packageService = frontendContainer.get<SubscriptionPackageFrontendService>(
  subscriptionPackageModuleNames.service,
);

const PackageMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createPackageMutation = useManagedMutation({
    mutationFn: (payload: CreateSubscriptionPackageRequest) =>
      packageService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  const updatePackageMutation = useManagedMutation({
    mutationFn: (params: { id: number; payload: UpdateSubscriptionPackageRequest }) =>
      packageService.update({ id: String(params.id), ...params.payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  const activatePackageMutation = useManagedMutation({
    mutationFn: (id: number) =>
      packageService.activate({ id: String(id) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  const deactivatePackageMutation = useManagedMutation({
    mutationFn: (id: number) =>
      packageService.deactivate({ id: String(id) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  useMirrorRegistry("createPackage", async (payload: CreateSubscriptionPackageRequest) =>
    createPackageMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updatePackage",
    async (id: number, payload: UpdateSubscriptionPackageRequest) =>
      updatePackageMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry("activatePackage", async (id: number) =>
    activatePackageMutation.mutateAsync(id),
  );
  useMirrorRegistry("deactivatePackage", async (id: number) =>
    deactivatePackageMutation.mutateAsync(id),
  );

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { PackageMutations };
