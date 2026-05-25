"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import { roleModuleNames, RoleFrontendService } from "@/modules/role";
import { useMirrorRegistry } from "../store";
import { CreateRoleRequest, UpdateRoleRequest } from "../types";

const roleService = frontendContainer.get<RoleFrontendService>(roleModuleNames.service);

const RoleMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createRoleMutation = useManagedMutation({
    mutationFn: (payload: CreateRoleRequest) => roleService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  const updateRoleMutation = useManagedMutation({
    mutationFn: (params: { id: string; payload: UpdateRoleRequest }) =>
      roleService.update({ id: params.id, name: params.payload.name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  const deleteRoleMutation = useManagedMutation({
    mutationFn: (id: string) => roleService.delete({ id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  useMirrorRegistry("createRole", async (payload: CreateRoleRequest) =>
    createRoleMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updateRole",
    async (id: string, payload: UpdateRoleRequest) =>
      updateRoleMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry("deleteRole", async (id: string) => deleteRoleMutation.mutateAsync(id));

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { RoleMutations };
