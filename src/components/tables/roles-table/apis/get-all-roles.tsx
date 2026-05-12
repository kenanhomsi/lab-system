"use client";

import { frontendContainer } from "@/container";
import { roleModuleNames, RoleFrontendService } from "@/modules/role";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { RolesResponse } from "../types";

const roleService = frontendContainer.get<RoleFrontendService>(roleModuleNames.service);

async function getAllRoles(params: { pageNumber: number }): Promise<RolesResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
  };
  const payload = await roleService.findAll({ query });
  console.log('in apis ', payload)
  if (!payload) {
    throw new Error("Failed to fetch roles");
  }
  return payload;
}

const GetAllRoles = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-roles", pageNumber],
    queryFn: () => getAllRoles({ pageNumber }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("rolesData", data!);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchRoles", () => {
    void refetch();
  });

  return props;
};

export { GetAllRoles };
