"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreateAppointmentRequest } from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Appointments API request failed");
  }
  return payload;
}

async function requestJson<TPayload>(url: string, method: string, payload?: TPayload) {
  const response = await fetch(url, {
    method,
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  return parseOrThrow(response);
}

const AppointmentsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createAppointmentMutation = useMutation({
    mutationFn: (payload: CreateAppointmentRequest) =>
      requestJson("/api/admin/appointments", "POST", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const confirmAppointmentMutation = useMutation({
    mutationFn: (id: number) => requestJson(`/api/admin/appointments/${id}/confirm`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: (id: number) => requestJson(`/api/admin/appointments/${id}/cancel`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  useMirrorRegistry("createAppointment", async (payload: CreateAppointmentRequest) =>
    createAppointmentMutation.mutateAsync(payload),
  );
  useMirrorRegistry("confirmAppointment", async (id: number) =>
    confirmAppointmentMutation.mutateAsync(id),
  );
  useMirrorRegistry("cancelAppointment", async (id: number) =>
    cancelAppointmentMutation.mutateAsync(id),
  );

  return props;
};

export { AppointmentsMutations };
