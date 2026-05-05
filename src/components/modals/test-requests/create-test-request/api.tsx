"use client";

import { frontendContainer } from "@/container";
import {
  CreateTestRequestCommand,
  testRequestModuleNames,
  type CreateTestRequestFrontendParams,
} from "@/modules/TestRequests";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const command = frontendContainer.get<CreateTestRequestCommand>(
  testRequestModuleNames.createTestRequestCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateTestRequestFrontendParams) => {
      command.init(payload);
      return command.exec();
    },
  });
  useMirrorRegistry("submitAction", mutation.mutateAsync);
  return <>{children}</>;
};

export { Api };
