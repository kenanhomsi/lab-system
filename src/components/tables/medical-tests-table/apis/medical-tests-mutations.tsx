"use client";

import { frontendContainer } from "@/container";
import {
  CreateMedicalTestCommand,
  DeleteMedicalTestCommand,
  UpdateMedicalTestCommand,
  medicalTestModuleNames,
} from "@/modules/medical-tests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import {
  CreateMedicalTestParams,
  DeleteMedicalTestParams,
  UpdateMedicalTestParams,
} from "@/modules/medical-tests/frontend/types";

const createMedicalTestCommand = frontendContainer.get<CreateMedicalTestCommand>(
  medicalTestModuleNames.createMedicalTestCommand,
);

const updateMedicalTestCommand = frontendContainer.get<UpdateMedicalTestCommand>(
  medicalTestModuleNames.updateMedicalTestCommand,
);

const deleteMedicalTestCommand = frontendContainer.get<DeleteMedicalTestCommand>(
  medicalTestModuleNames.deleteMedicalTestCommand,
);

const MedicalTestsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateMedicalTestParams) => {
      createMedicalTestCommand.init(data);
      return await createMedicalTestCommand.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medical-tests"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (params: { id: string; data: Omit<UpdateMedicalTestParams, "id"> }) => {
      updateMedicalTestCommand.init({ id: params.id, ...params.data });
      return await updateMedicalTestCommand.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medical-tests"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (params: DeleteMedicalTestParams) => {
      deleteMedicalTestCommand.init(params);
      return await deleteMedicalTestCommand.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medical-tests"] });
    },
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", {
    mutateAsync: async (params: { id: string; data: Omit<UpdateMedicalTestParams, "id"> }) => {
      return await updateMutation.mutateAsync(params);
    },
  });
  useMirrorRegistry("deleteMutation", {
    mutateAsync: async (id: string) => {
      return await deleteMutation.mutateAsync({ id });
    },
  });

  return <>{props.children}</>;
};

export { MedicalTestsMutations };

