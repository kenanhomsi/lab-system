"use client";

import { frontendContainer } from "@/container";
import {
  ExternalPatientsFrontendService,
  externalPatientsModuleNames,
} from "@/modules/ExternalPatients";
import type {
  CreateExternalPatientFrontendParams,
  LinkDirectPatientFrontendParams,
} from "@/modules/ExternalPatients/frontend/types";
import { useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const service = frontendContainer.get<ExternalPatientsFrontendService>(
  externalPatientsModuleNames.service,
);

const ExternalPatientsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useManagedMutation({
    mutationFn: async (data: CreateExternalPatientFrontendParams) => service.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-patients"] });
    },
  });

  const linkMutation = useManagedMutation({
    mutationFn: async (params: LinkDirectPatientFrontendParams) =>
      service.linkDirectPatient(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-patients"] });
    },
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("linkMutation", { mutateAsync: linkMutation.mutateAsync });

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { ExternalPatientsMutations };
