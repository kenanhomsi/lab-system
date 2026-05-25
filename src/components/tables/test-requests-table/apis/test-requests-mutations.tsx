"use client";

import { frontendContainer } from "@/container";
import {
  CreateTestRequestCommand,
  DeleteTestRequestCommand,
  UpdateTestRequestCommand,
  testRequestModuleNames,
} from "@/modules/TestRequests";
import {
  CreateTestRequestFrontendParams,
  DeleteTestRequestFrontendParams,
  UpdateTestRequestFrontendParams,
} from "@/modules/TestRequests/frontend/types";
import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const createCommand = frontendContainer.get<CreateTestRequestCommand>(testRequestModuleNames.createTestRequestCommand);
const updateCommand = frontendContainer.get<UpdateTestRequestCommand>(testRequestModuleNames.updateTestRequestCommand);
const deleteCommand = frontendContainer.get<DeleteTestRequestCommand>(testRequestModuleNames.deleteTestRequestCommand);

const TestRequestsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useManagedMutation({
    mutationFn: async (data: CreateTestRequestFrontendParams) => {
      createCommand.init(data);
      return createCommand.exec();
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["test-requests"] }); },
  });

  const updateMutation = useManagedMutation({
    mutationFn: async (params: { id: string; data: Omit<UpdateTestRequestFrontendParams, "id"> }) => {
      updateCommand.init({ id: params.id, ...params.data });
      return updateCommand.exec();
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["test-requests"] }); },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: async (params: DeleteTestRequestFrontendParams) => {
      deleteCommand.init(params);
      return deleteCommand.exec();
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["test-requests"] }); },
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", {
    mutateAsync: async (params: { id: string; data: Omit<UpdateTestRequestFrontendParams, "id"> }) => updateMutation.mutateAsync(params),
  });
  useMirrorRegistry("deleteMutation", { mutateAsync: async (id: string) => deleteMutation.mutateAsync({ id }) });

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { TestRequestsMutations };
