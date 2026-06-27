"use client";

import { frontendContainer } from "@/container";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import {
  MedicalTestCategoryFrontendService,
  medicalTestCategoryModuleNames,
  UpsertMedicalTestCategoryInput,
} from "@/modules/medical-test-categories";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const categoryService = frontendContainer.get<MedicalTestCategoryFrontendService>(
  medicalTestCategoryModuleNames.service,
);

const Mutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["medical-test-categories"] });
  };

  const createMutation = useManagedMutation({
    mutationFn: (data: UpsertMedicalTestCategoryInput) => categoryService.create(data),
    onSuccess: invalidate,
  });

  const updateMutation = useManagedMutation({
    mutationFn: (params: { id: number; data: UpsertMedicalTestCategoryInput }) =>
      categoryService.update({ id: params.id, ...params.data }),
    onSuccess: invalidate,
  });

  const deleteMutation = useManagedMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: invalidate,
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", { mutateAsync: updateMutation.mutateAsync });
  useMirrorRegistry("deleteMutation", { mutateAsync: deleteMutation.mutateAsync });

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Mutations };
