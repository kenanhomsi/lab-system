"use client";

import { useMirror as useTableMirror } from "@/components/tables/roles-table/store";
import { frontendContainer } from "@/container";
import {
  permissionModuleNames,
  PermissionFrontendService,
} from "@/modules/permission";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { PermissionCatalogItem } from "./types";

const permissionService = frontendContainer.get<PermissionFrontendService>(
  permissionModuleNames.service,
);

async function fetchCatalog(): Promise<PermissionCatalogItem[]> {
  const payload = await permissionService.findAll({ query: { PageSize: "200" } });
  if (!Array.isArray(payload)) {
    return [];
  }
  return payload.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }));
}

const Api = ({ children }: PropsWithChildren) => {
  const role = useMirror("role");
  const isOpen = useMirror("isOpen");

  const getRolePermissionsApi = useTableMirror("getRolePermissions");
  const assignRolePermissionApi = useTableMirror("assignRolePermission");
  const removeRolePermissionApi = useTableMirror("removeRolePermission");

  const enabledRolePerms = Boolean(isOpen && role?.id);
  const enabledCatalog = Boolean(isOpen);

  const rolePermissionsQuery = useQuery({
    queryKey: ["admin-role-permissions", role?.id],
    queryFn: () => getRolePermissionsApi(role!.id),
    enabled: enabledRolePerms,
  });

  const catalogQuery = useQuery({
    queryKey: ["admin-permissions-catalog"],
    queryFn: fetchCatalog,
    enabled: enabledCatalog,
    staleTime: 1000 * 60 * 5,
  });

  useMirrorRegistry("rolePermissions", rolePermissionsQuery.data ?? []);
  useMirrorRegistry("isRolePermissionsLoading", rolePermissionsQuery.isPending && enabledRolePerms);
  useMirrorRegistry("catalogPermissions", catalogQuery.data ?? []);
  useMirrorRegistry("isCatalogLoading", catalogQuery.isPending && enabledCatalog);
  useMirrorRegistry("refetchRolePermissions", () => {
    void rolePermissionsQuery.refetch();
  });
  useMirrorRegistry("assignRolePermissionApi", assignRolePermissionApi);
  useMirrorRegistry("removeRolePermissionApi", removeRolePermissionApi);

  return <>{children}</>;
};

export { Api };
