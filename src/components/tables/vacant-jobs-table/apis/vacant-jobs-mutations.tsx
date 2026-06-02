"use client";

import { frontendContainer } from "@/container";
import {
  CreateVacantJobCommand,
  DeleteVacantJobCommand,
  UpdateVacantJobCommand,
  vacantJobModuleNames,
} from "@/modules/vacant-jobs";
import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import {
  CreateVacantJobParams,
  DeleteVacantJobParams,
  UpdateVacantJobParams,
} from "@/modules/vacant-jobs/frontend/types";

const createVacantJobCommand = frontendContainer.get<CreateVacantJobCommand>(
  vacantJobModuleNames.createVacantJobCommand,
);

const updateVacantJobCommand = frontendContainer.get<UpdateVacantJobCommand>(
  vacantJobModuleNames.updateVacantJobCommand,
);

const deleteVacantJobCommand = frontendContainer.get<DeleteVacantJobCommand>(
  vacantJobModuleNames.deleteVacantJobCommand,
);

const VacantJobsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useManagedMutation({
    mutationFn: async (data: CreateVacantJobParams) => {
      createVacantJobCommand.init(data);
      return await createVacantJobCommand.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vacant-jobs"] });
    },
  });

  const updateMutation = useManagedMutation({
    mutationFn: async (params: { id: string; data: Omit<UpdateVacantJobParams, "id"> }) => {
      updateVacantJobCommand.init({ id: params.id, ...params.data });
      return await updateVacantJobCommand.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vacant-jobs"] });
    },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: async (params: DeleteVacantJobParams) => {
      deleteVacantJobCommand.init(params);
      return await deleteVacantJobCommand.exec();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vacant-jobs"] });
    },
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("updateMutation", {
    mutateAsync: async (params: { id: string; data: Omit<UpdateVacantJobParams, "id"> }) => {
      return await updateMutation.mutateAsync(params);
    },
  });
  useMirrorRegistry("deleteMutation", {
    mutateAsync: async (id: string) => {
      return await deleteMutation.mutateAsync({ id });
    },
  });

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { VacantJobsMutations };
