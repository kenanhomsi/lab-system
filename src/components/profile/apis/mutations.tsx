"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import { userModuleNames, UserFrontendService } from "@/modules/user";
import { useMirrorRegistry } from "../store";
import type { ChangePasswordRequest, UpdateMeRequest } from "../types";

const userService = frontendContainer.get<UserFrontendService>(userModuleNames.service);

const Mutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const updateMeMutation = useManagedMutation({
    mutationFn: (payload: UpdateMeRequest) => userService.updateMe(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const changePasswordMutation = useManagedMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      userService.changePasswordMe(payload),
  });

  const requestDeletionMutation = useManagedMutation({
    mutationFn: () => userService.requestDeletionMe({}),
  });

  useMirrorRegistry("updateMe", async (payload: UpdateMeRequest) =>
    updateMeMutation.mutateAsync(payload),
  );
  useMirrorRegistry("changePassword", async (payload: ChangePasswordRequest) =>
    changePasswordMutation.mutateAsync(payload),
  );
  useMirrorRegistry("requestDeletion", async () => requestDeletionMutation.mutateAsync());

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { Mutations };
