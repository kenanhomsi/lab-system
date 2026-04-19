"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import {
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Appointment types API request failed");
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

const AppointmentTypeMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateAppointmentTypeRequest) =>
      requestJson("/api/admin/appointment-types", "POST", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-appointment-types"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; payload: UpdateAppointmentTypeRequest }) =>
      requestJson(`/api/admin/appointment-types/${params.id}`, "PUT", params.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-appointment-types"] });
    },
  });

  useMirrorRegistry(
    "createAppointmentType",
    async (payload: CreateAppointmentTypeRequest) => createMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updateAppointmentType",
    async (id: number, payload: UpdateAppointmentTypeRequest) =>
      updateMutation.mutateAsync({ id, payload }),
  );

  return props;
};

export { AppointmentTypeMutations };
