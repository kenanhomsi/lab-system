"use client";

import { frontendContainer } from "@/container";
import {
  UpdateTestRequestCommand,
  testRequestModuleNames,
  type UpdateTestRequestFrontendParams,
} from "@/modules/TestRequests";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const command = frontendContainer.get<UpdateTestRequestCommand>(
  testRequestModuleNames.updateTestRequestCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const mutation = useMutation({
    mutationFn: async (payload: UpdateTestRequestFrontendParams) => {
      command.init(payload);
      return command.exec();
    },
  });
  useMirrorRegistry("submitAction", mutation.mutateAsync);
  return <>{children}</>;
};

export { Api };
