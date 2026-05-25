"use client";

import { frontendContainer } from "@/container";
import {
  UpdateTestRequestCommand,
  testRequestModuleNames,
  type UpdateTestRequestFrontendParams,
} from "@/modules/TestRequests";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const command = frontendContainer.get<UpdateTestRequestCommand>(
  testRequestModuleNames.updateTestRequestCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const mutation = useManagedMutation({
    mutationFn: async (payload: UpdateTestRequestFrontendParams) => {
      command.init(payload);
      return command.exec();
    },
  });
  useMirrorRegistry("submitAction", mutation.mutateAsync);
  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
