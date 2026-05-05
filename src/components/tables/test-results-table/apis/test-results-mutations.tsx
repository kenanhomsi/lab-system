"use client";

import { frontendContainer } from "@/container";
import {
  CreateTestResultCommand,
  DeleteTestResultCommand,
  UpdateTestResultCommand,
  testResultModuleNames,
} from "@/modules/TestResults";
import {
  CreateTestResultFrontendParams,
  DeleteTestResultFrontendParams,
  UpdateTestResultFrontendParams,
} from "@/modules/TestResults/frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const createCommand = frontendContainer.get<CreateTestResultCommand>(testResultModuleNames.createTestResultCommand);
const updateCommand = frontendContainer.get<UpdateTestResultCommand>(testResultModuleNames.updateTestResultCommand);
const deleteCommand = frontendContainer.get<DeleteTestResultCommand>(testResultModuleNames.deleteTestResultCommand);

const TestResultsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateTestResultFrontendParams) => {
      createCommand.init(data);
      return createCommand.exec();
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["test-results"] }); },
  });

  const updateMutation = useMutation({
    mutationFn: async (params: { id: string; data: Omit<UpdateTestResultFrontendParams, "id"> }) => {
      updateCommand.init({ id: params.id, ...params.data });
      return updateCommand.exec();
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["test-results"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (params: DeleteTestResultFrontendParams) => {
      deleteCommand.init(params);
      return deleteCommand.exec();
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["test-results"] }); },
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", {
    mutateAsync: async (params: { id: string; data: Omit<UpdateTestResultFrontendParams, "id"> }) => updateMutation.mutateAsync(params),
  });
  useMirrorRegistry("deleteMutation", { mutateAsync: async (id: string) => deleteMutation.mutateAsync({ id }) });

  return <>{props.children}</>;
};

export { TestResultsMutations };
