"use client";

import { frontendContainer } from "@/container";
import {
  InsuranceApprovalRequestFrontendService,
  insuranceApprovalRequestModuleNames,
} from "@/modules/insurance-approval-request";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import type { CreateInsuranceApprovalPayload } from "../types";

const service = frontendContainer.get<InsuranceApprovalRequestFrontendService>(
  insuranceApprovalRequestModuleNames.service,
);

const MyInsuranceApprovalMutations = (props: PropsWithChildren) => {
  const t = useTranslations("myInsuranceApproval");
  const queryClient = useQueryClient();

  const createMutation = useManagedMutation({
    mutationFn: (payload: CreateInsuranceApprovalPayload) => service.create(payload),
    onSuccess: async (res) => {
      notifications.show({
        title: t("createSuccessTitle"),
        message: res?.message ?? t("createSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["my-insurance-approval-requests"] });
    },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: (id: number) => service.remove(String(id)),
    onSuccess: async () => {
      notifications.show({
        title: t("deleteSuccessTitle"),
        message: t("deleteSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["my-insurance-approval-requests"] });
    },
  });

  useMirrorRegistry("createRequest", async (payload: CreateInsuranceApprovalPayload) =>
    createMutation.mutateAsync(payload),
  );
  useMirrorRegistry("isCreating", createMutation.isPending);
  useMirrorRegistry("removeRequest", async (id: number) => deleteMutation.mutateAsync(id));
  useMirrorRegistry("isDeleting", deleteMutation.isPending);

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { MyInsuranceApprovalMutations };
