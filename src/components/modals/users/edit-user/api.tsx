"use client";

import { frontendContainer } from "@/container";
import { UpdateUserCommand, userModuleNames } from "@/modules/user";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { UpdateUserPayload } from "./types";

const updateUserCommand = frontendContainer.get<UpdateUserCommand>(
  userModuleNames.updateUserCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const updateMutation = useMutation({
    mutationFn: async (params: { id: string; payload: UpdateUserPayload }) => {
      updateUserCommand.init({ id: params.id, ...params.payload });
      return updateUserCommand.exec();
    },
  });

  useMirrorRegistry("submitUpdate", async (params: { id: string; payload: UpdateUserPayload }) =>
    updateMutation.mutateAsync(params),
  );

  return <>{children}</>;
};

export { Api };
