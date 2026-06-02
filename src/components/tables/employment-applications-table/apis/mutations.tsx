"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { useMirrorRegistry } from "../store";
import type { EmploymentApplicationStatus } from "../types";

const EmploymentApplicationsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: number;
      status: EmploymentApplicationStatus;
      notes?: string;
    }) => {
      const res = await axiosInstanceFront.put(`/employment-applications/${id}/status`, {
        status,
        notes,
      });
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employment-applications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstanceFront.delete(`/employment-applications/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employment-applications"] });
    },
  });

  useMirrorRegistry(
    "updateStatus",
    (payload: { id: number; status: EmploymentApplicationStatus; notes?: string }) =>
    updateStatusMutation.mutateAsync(payload),
  );
  useMirrorRegistry("deleteApplication", (id: number) => deleteMutation.mutateAsync(id));
  useMirrorRegistry("isUpdatingStatus", updateStatusMutation.isPending);
  useMirrorRegistry("isDeleting", deleteMutation.isPending);

  return <>{props.children}</>;
};

export { EmploymentApplicationsMutations };
