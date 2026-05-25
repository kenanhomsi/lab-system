"use client";

import { frontendContainer } from "@/container";
import { UserFrontendService, userModuleNames } from "@/modules/user";
import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const userService = frontendContainer.get<UserFrontendService>(userModuleNames.service);

const Api = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const assignMutation = useManagedMutation({
    mutationFn: async (params: { id: string; permissions: string[] }) =>
      userService.assignPermissions({ id: params.id, permissions: params.permissions }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const replaceMutation = useManagedMutation({
    mutationFn: async (params: { id: string; permissions: string[] }) =>
      userService.replacePermissions({ id: params.id, permissions: params.permissions }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeMutation = useManagedMutation({
    mutationFn: async (params: { id: string; permission: string }) =>
      userService.removePermission({ id: params.id, permission: params.permission }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useMirrorRegistry("getPermissionsApi", async (id: string) =>
    userService.getPermissions({ id }),
  );
  useMirrorRegistry(
    "assignPermissionsApi",
    async (params: { id: string; permissions: string[] }) => assignMutation.mutateAsync(params),
  );
  useMirrorRegistry(
    "replacePermissionsApi",
    async (params: { id: string; permissions: string[] }) => replaceMutation.mutateAsync(params),
  );
  useMirrorRegistry(
    "removePermissionApi",
    async (params: { id: string; permission: string }) => removeMutation.mutateAsync(params),
  );

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
