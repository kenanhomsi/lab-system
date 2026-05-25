"use client";

import { frontendContainer } from "@/container";
import { UpdateTestResultCommand, testResultModuleNames } from "@/modules/TestResults";
import type { UpdateTestResultFrontendParams } from "@/modules/TestResults/frontend/types";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const command = frontendContainer.get<UpdateTestResultCommand>(
  testResultModuleNames.updateTestResultCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const mutation = useManagedMutation({
    mutationFn: async (payload: UpdateTestResultFrontendParams) => {
      command.init(payload);
      return command.exec();
    },
  });
  useMirrorRegistry("submitAction", mutation.mutateAsync);
  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
