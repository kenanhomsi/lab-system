"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import {
  AccessPolicyFrontendService,
  accessPolicyModuleNames,
} from "@/modules/access-policy";
import { useMirrorRegistry } from "../store";
import { CreateAccessPolicyRequest, UpdateAccessPolicyRequest } from "../types";

const accessPolicyService = frontendContainer.get<AccessPolicyFrontendService>(
  accessPolicyModuleNames.service,
);

const AccessPolicyMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useManagedMutation({
    mutationFn: (payload: CreateAccessPolicyRequest) =>
      accessPolicyService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const updateMutation = useManagedMutation({
    mutationFn: (params: { id: string; payload: UpdateAccessPolicyRequest }) =>
      accessPolicyService.update({ id: params.id, ...params.payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: (id: string) => accessPolicyService.delete({ id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const enableMutation = useManagedMutation({
    mutationFn: (id: string) => accessPolicyService.enable({ id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const disableMutation = useManagedMutation({
    mutationFn: (id: string) => accessPolicyService.disable({ id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const validateMutation = useManagedMutation({
    mutationFn: (payload: CreateAccessPolicyRequest) =>
      accessPolicyService.validate(payload),
  });

  useMirrorRegistry(
    "createAccessPolicy",
    async (payload: CreateAccessPolicyRequest) => createMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updateAccessPolicy",
    async (id: string, payload: UpdateAccessPolicyRequest) =>
      updateMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry(
    "deleteAccessPolicy",
    async (id: string) => deleteMutation.mutateAsync(id),
  );
  useMirrorRegistry(
    "enableAccessPolicy",
    async (id: string) => enableMutation.mutateAsync(id),
  );
  useMirrorRegistry(
    "disableAccessPolicy",
    async (id: string) => disableMutation.mutateAsync(id),
  );
  useMirrorRegistry(
    "validateAccessPolicy",
    async (payload: CreateAccessPolicyRequest) => validateMutation.mutateAsync(payload),
  );

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { AccessPolicyMutations };
