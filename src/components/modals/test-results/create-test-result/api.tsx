"use client";

import { frontendContainer } from "@/container";
import { CreateTestResultCommand, testResultModuleNames } from "@/modules/TestResults";
import type { CreateTestResultFrontendParams } from "@/modules/TestResults/frontend/types";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const command = frontendContainer.get<CreateTestResultCommand>(
  testResultModuleNames.createTestResultCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const mutation = useManagedMutation({
    mutationFn: async (payload: CreateTestResultFrontendParams) => {
      command.init(payload);
      return command.exec();
    },
  });
  useMirrorRegistry("submitAction", mutation.mutateAsync);
  useMirrorRegistry("isSubmitting", mutation.isPending, "value");
  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
