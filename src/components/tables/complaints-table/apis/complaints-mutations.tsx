"use client";

import { frontendContainer } from "@/container";
import { EventService, eventModuleNames } from "@/modules/events";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { ComplaintStatus } from "../types";

const eventService = frontendContainer.get<EventService>(eventModuleNames.service);

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Complaints API request failed");
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

const ComplaintsMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const updateComplaintStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ComplaintStatus }) =>
      requestJson(`/api/admin/complaints/${encodeURIComponent(String(id))}/status`, "PUT", {
        status,
      }),
    onSuccess: async () => {
      eventService.emit("complaintStatusUpdatedSuccessfully", undefined);
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });

  useMirrorRegistry("updateComplaintStatus", async (id: number, status: ComplaintStatus) =>
    updateComplaintStatusMutation.mutateAsync({ id, status }),
  );

  return props;
};

export { ComplaintsMutations };
