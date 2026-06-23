"use client";

import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import {
  appointmentsClient,
  type AppointmentAdminStatus,
} from "@/modules/appointments";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { useMirrorRegistry } from "../store";

/**
 * Registers cancel and status mutations for blood draw appointments.
 */
const AppointmentMutations = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const invalidateAppointments = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-blood-draw-appointments"] });
    await queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  const cancelMutation = useManagedMutation({
    mutationFn: async (id: number) => {
      await appointmentsClient.cancel(id);
    },
    onSuccess: invalidateAppointments,
  });

  const updateStatusMutation = useManagedMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: AppointmentAdminStatus;
    }) => {
      await appointmentsClient.updateStatus(id, status);
    },
    onSuccess: invalidateAppointments,
  });

  useMirrorRegistry("cancelAppointment", async (id: number) => cancelMutation.mutateAsync(id));
  useMirrorRegistry(
    "updateAppointmentStatus",
    async (payload: { id: number; status: AppointmentAdminStatus }) =>
      updateStatusMutation.mutateAsync(payload),
  );

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { AppointmentMutations };
