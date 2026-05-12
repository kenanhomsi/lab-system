"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreateRoleRequest, UpdateRoleRequest } from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Roles API request failed");
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

const RoleMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createRoleMutation = useMutation({
    mutationFn: (payload: CreateRoleRequest) =>
      requestJson("/api/admin/roles", "POST", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (params: { id: string; payload: UpdateRoleRequest }) =>
      requestJson(`/api/admin/roles/${params.id}`, "PUT", params.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => requestJson(`/api/admin/roles/${id}`, "DELETE"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  useMirrorRegistry("createRole", async (payload: CreateRoleRequest) =>
    createRoleMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updateRole",
    async (id: string, payload: UpdateRoleRequest) =>
      updateRoleMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry("deleteRole", async (id: string) => deleteRoleMutation.mutateAsync(id));

  return props;
};

export { RoleMutations };
