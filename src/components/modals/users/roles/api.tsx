"use client";

import { frontendContainer } from "@/container";
import { UserFrontendService, userModuleNames } from "@/modules/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const userService = frontendContainer.get<UserFrontendService>(userModuleNames.service);

const Api = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const assignMutation = useMutation({
    mutationFn: async (params: { id: string; roles: string[] }) =>
      userService.assignRoles({ id: params.id, roles: params.roles }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (params: { id: string; roles: string[] }) =>
      userService.removeRoles({ id: params.id, roles: params.roles }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useMirrorRegistry("assignRolesApi", async (params: { id: string; roles: string[] }) =>
    assignMutation.mutateAsync(params),
  );
  useMirrorRegistry("removeRolesApi", async (params: { id: string; roles: string[] }) =>
    removeMutation.mutateAsync(params),
  );

  return <>{children}</>;
};

export { Api };
