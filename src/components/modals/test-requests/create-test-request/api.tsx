"use client";

import { frontendContainer } from "@/container";
import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import {
  CreateTestRequestCommand,
  testRequestModuleNames,
  type CreateTestRequestFrontendParams,
} from "@/modules/TestRequests";

const command = frontendContainer.get<CreateTestRequestCommand>(
  testRequestModuleNames.createTestRequestCommand,
);

const Api = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const mutation = useManagedMutation({
    mutationFn: async (payload: CreateTestRequestFrontendParams) => {
      command.init(payload);
      return command.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["test-requests"] });
    },
  });
  useMirrorRegistry("submitAction", mutation.mutateAsync);
  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
