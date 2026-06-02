"use client";

import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import type { UpdateStatusPayload } from "../types";

const ClientJoinRequestMutations = (props: PropsWithChildren) => {
  const t = useTranslations("admin.clientJoinRequests");
  const queryClient = useQueryClient();

  const updateMutation = useManagedMutation({
    mutationFn: (payload: UpdateStatusPayload) =>
      axiosInstanceFront.put(
        `/client-join-requests/${payload.id}/status`,
        { status: payload.status, notes: payload.notes },
      ),
    onSuccess: async () => {
      notifications.show({
        title: t("statusUpdateSuccessTitle"),
        message: t("statusUpdateSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["client-join-requests"] });
    },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: (id: number) =>
      axiosInstanceFront.delete(`/client-join-requests/${id}`),
    onSuccess: async () => {
      notifications.show({
        title: t("deleteSuccessTitle"),
        message: t("deleteSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["client-join-requests"] });
    },
  });

  useMirrorRegistry("updateStatus", async (payload: UpdateStatusPayload) =>
    updateMutation.mutateAsync(payload),
  );
  useMirrorRegistry("isUpdatingStatus", updateMutation.isPending);
  useMirrorRegistry("removeRequest", async (id: number) => {
    await deleteMutation.mutateAsync(id);
  });
  useMirrorRegistry("isDeleting", deleteMutation.isPending);

  return <MutationErrorProvider>{props.children}</MutationErrorProvider>;
};

export { ClientJoinRequestMutations };
