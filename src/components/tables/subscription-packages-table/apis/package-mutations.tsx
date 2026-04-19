"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import {
  CreateSubscriptionPackageRequest,
  UpdateSubscriptionPackageRequest,
} from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Subscription packages API request failed");
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

const PackageMutations = (props: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const createPackageMutation = useMutation({
    mutationFn: (payload: CreateSubscriptionPackageRequest) =>
      requestJson("/api/admin/subscription-packages", "POST", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: (params: { id: number; payload: UpdateSubscriptionPackageRequest }) =>
      requestJson(`/api/admin/subscription-packages/${params.id}`, "PUT", params.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  const activatePackageMutation = useMutation({
    mutationFn: (id: number) => requestJson(`/api/admin/subscription-packages/${id}/activate`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  const deactivatePackageMutation = useMutation({
    mutationFn: (id: number) =>
      requestJson(`/api/admin/subscription-packages/${id}/deactivate`, "POST"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });

  useMirrorRegistry("createPackage", async (payload: CreateSubscriptionPackageRequest) =>
    createPackageMutation.mutateAsync(payload),
  );
  useMirrorRegistry(
    "updatePackage",
    async (id: number, payload: UpdateSubscriptionPackageRequest) =>
      updatePackageMutation.mutateAsync({ id, payload }),
  );
  useMirrorRegistry("activatePackage", async (id: number) =>
    activatePackageMutation.mutateAsync(id),
  );
  useMirrorRegistry("deactivatePackage", async (id: number) =>
    deactivatePackageMutation.mutateAsync(id),
  );

  return props;
};

export { PackageMutations };
