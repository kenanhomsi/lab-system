"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import type { ChangePasswordRequest, UpdateMeRequest } from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Profile API request failed");
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

const Mutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const updateMeMutation = useMutation({
    mutationFn: (payload: UpdateMeRequest) => requestJson("/api/users/me", "PUT", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      requestJson("/api/users/me/change-password", "PUT", payload),
  });

  const requestDeletionMutation = useMutation({
    mutationFn: () => requestJson("/api/users/me/request-deletion", "POST"),
  });

  useMirrorRegistry("updateMe", async (payload: UpdateMeRequest) =>
    updateMeMutation.mutateAsync(payload),
  );
  useMirrorRegistry("changePassword", async (payload: ChangePasswordRequest) =>
    changePasswordMutation.mutateAsync(payload),
  );
  useMirrorRegistry("requestDeletion", async () => requestDeletionMutation.mutateAsync());

  return props;
};

export { Mutations };

