"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { CreateAccessPolicyRequest, UpdateAccessPolicyRequest } from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Access policies API request failed");
  }
  return payload;
}

async function requestJson<TPayload>(url: string, method: string, payload?: TPayload) {
  const response = await fetch(url, {
    method,
    headers: payload !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });
  return parseOrThrow(response);
}

async function requestWithoutBody(url: string, method: string) {
  const response = await fetch(url, { method });
  return parseOrThrow(response);
}

const AccessPolicyMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateAccessPolicyRequest) =>
      requestJson("/api/admin/access-policies", "POST", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; payload: UpdateAccessPolicyRequest }) =>
      requestJson(`/api/admin/access-policies/${params.id}`, "PUT", params.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => requestWithoutBody(`/api/admin/access-policies/${id}`, "DELETE"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const enableMutation = useMutation({
    mutationFn: (id: string) =>
      requestWithoutBody(`/api/admin/access-policies/${encodeURIComponent(id)}/enable`, "PATCH"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const disableMutation = useMutation({
    mutationFn: (id: string) =>
      requestWithoutBody(`/api/admin/access-policies/${encodeURIComponent(id)}/disable`, "PATCH"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-access-policies"] });
    },
  });

  const validateMutation = useMutation({
    mutationFn: (payload: CreateAccessPolicyRequest) =>
      requestJson("/api/admin/access-policies/validate", "POST", payload),
  });

  useMirrorRegistry(
    "createAccessPolicy",
    async (payload: CreateAccessPolicyRequest) => createMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updateAccessPolicy",
    async (id: string, payload: UpdateAccessPolicyRequest) =>
      updateMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry(
    "deleteAccessPolicy",
    async (id: string) => deleteMutation.mutateAsync(id),
  );
  useMirrorRegistry(
    "enableAccessPolicy",
    async (id: string) => enableMutation.mutateAsync(id),
  );
  useMirrorRegistry(
    "disableAccessPolicy",
    async (id: string) => disableMutation.mutateAsync(id),
  );
  useMirrorRegistry(
    "validateAccessPolicy",
    async (payload: CreateAccessPolicyRequest) => validateMutation.mutateAsync(payload),
  );

  return props;
};

export { AccessPolicyMutations };
