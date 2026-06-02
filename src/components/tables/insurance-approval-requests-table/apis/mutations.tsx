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
import type { UpdateStatusPayload } from "../types";

const service = frontendContainer.get<InsuranceApprovalRequestFrontendService>(
  insuranceApprovalRequestModuleNames.service,
);

const InsuranceApprovalMutations = (props: PropsWithChildren) => {
  const t = useTranslations("admin.insuranceApproval");
  const queryClient = useQueryClient();

  const updateMutation = useManagedMutation({
    mutationFn: (payload: UpdateStatusPayload) =>
      service.updateStatus({
        id: String(payload.id),
        status: payload.status,
        notes: payload.notes,
        rejectionReason: payload.rejectionReason,
      }),
    onSuccess: async () => {
      notifications.show({
        title: t("statusUpdateSuccessTitle"),
        message: t("statusUpdateSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["insurance-approval-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["insurance-approval-detail"] });
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
      await queryClient.invalidateQueries({ queryKey: ["insurance-approval-requests"] });
    },
  });

  useMirrorRegistry("updateStatus", async (payload: UpdateStatusPayload) =>
    updateMutation.mutateAsync(payload),
  );
  useMirrorRegistry("isUpdatingStatus", updateMutation.isPending);
  useMirrorRegistry("removeRequest", async (id: number) => deleteMutation.mutateAsync(id));
  useMirrorRegistry("isDeleting", deleteMutation.isPending);

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { InsuranceApprovalMutations };
