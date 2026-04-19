"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Users API request failed");
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

const UsersMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const activateUserMutation = useMutation({
    mutationFn: (id: string) =>
      requestJson(`/api/admin/users/${encodeURIComponent(id)}/activate`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (id: string) =>
      requestJson(`/api/admin/users/${encodeURIComponent(id)}/deactivate`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  useMirrorRegistry("activateUser", async (id: string) => activateUserMutation.mutateAsync(id));
  useMirrorRegistry("deactivateUser", async (id: string) =>
    deactivateUserMutation.mutateAsync(id),
  );

  return props;
};

export { UsersMutations };
