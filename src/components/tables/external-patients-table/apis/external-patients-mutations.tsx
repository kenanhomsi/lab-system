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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const service = frontendContainer.get<ExternalPatientsFrontendService>(
  externalPatientsModuleNames.service,
);

const ExternalPatientsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateExternalPatientFrontendParams) => service.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-patients"] });
    },
  });

  const linkMutation = useMutation({
    mutationFn: async (params: LinkDirectPatientFrontendParams) =>
      service.linkDirectPatient(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-patients"] });
    },
  });

  useMirrorRegistry("createMutation", { mutateAsync: createMutation.mutateAsync });
  useMirrorRegistry("linkMutation", { mutateAsync: linkMutation.mutateAsync });

  return <>{props.children}</>;
};

export { ExternalPatientsMutations };
