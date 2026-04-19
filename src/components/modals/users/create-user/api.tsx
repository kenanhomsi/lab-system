"use client";

import { frontendContainer } from "@/container";
import { CreateUserCommand, userModuleNames } from "@/modules/user";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { CreateUserPayload } from "./types";

const createUserCommand = frontendContainer.get<CreateUserCommand>(
  userModuleNames.createUserCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const createMutation = useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      createUserCommand.init(payload);
      return createUserCommand.exec();
    },
  });

  useMirrorRegistry("submitCreate", async (payload: CreateUserPayload) =>
    createMutation.mutateAsync(payload),
  );

  return <>{children}</>;
};

export { Api };
