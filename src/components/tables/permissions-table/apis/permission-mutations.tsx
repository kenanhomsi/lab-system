"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreatePermissionRequest, UpdatePermissionRequest } from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Permissions API request failed");
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

const PermissionMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createPermissionMutation = useMutation({
    mutationFn: (payload: CreatePermissionRequest) =>
      requestJson("/api/admin/permissions", "POST", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: (params: { id: string; payload: UpdatePermissionRequest }) =>
      requestJson(`/api/admin/permissions/${params.id}`, "PUT", params.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (id: string) => requestJson(`/api/admin/permissions/${id}`, "DELETE"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
    },
  });

  useMirrorRegistry(
    "createPermission",
    async (payload: CreatePermissionRequest) => createPermissionMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updatePermission",
    async (id: string, payload: UpdatePermissionRequest) =>
      updatePermissionMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry(
    "deletePermission",
    async (id: string) => deletePermissionMutation.mutateAsync(id),
  );

  return props;
};

export { PermissionMutations };
