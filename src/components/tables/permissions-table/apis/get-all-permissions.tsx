"use client";

import { frontendContainer } from "@/container";
import { permissionModuleNames, PermissionFrontendService } from "@/modules/permission";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { PermissionsResponse } from "../types";

const permissionService = frontendContainer.get<PermissionFrontendService>(
  permissionModuleNames.service,
);

async function getAllPermissions(params: { pageNumber: number }): Promise<PermissionsResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
  };
  const payload = await permissionService.findAll({ query });
  if (!payload) {
    throw new Error("Failed to fetch permissions");
  }
  return payload;
}

const GetAllPermissions = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-permissions", pageNumber],
    queryFn: () => getAllPermissions({ pageNumber }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("permissionsData", data ?? []);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchPermissions", () => {
    void refetch();
  });

  return props;
};

export { GetAllPermissions };
