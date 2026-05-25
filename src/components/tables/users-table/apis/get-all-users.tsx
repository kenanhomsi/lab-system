"use client";

import { frontendContainer } from "@/container";
import { UserFrontendService, userModuleNames } from "@/modules/user";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { UsersResponse } from "../types";

const userService = frontendContainer.get<UserFrontendService>(
  userModuleNames.service,
);

async function getAllUsers(params: {
  pageNumber: number;
  search: string;
  isActive: "all" | "active" | "inactive";
  role: string;
  sortBy: string;
  sortDesc: boolean;
}): Promise<UsersResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "20",
    SortDesc: String(params.sortDesc),
  };

  if (params.search.trim()) query.Search = params.search.trim();
  if (params.isActive === "active") query.IsActive = "true";
  if (params.isActive === "inactive") query.IsActive = "false";
  if (params.role.trim()) query.Role = params.role.trim();
  if (params.sortBy.trim()) query.SortBy = params.sortBy.trim();

  const payload = await userService.findAll({
    query,
  });

  if (!payload) {
    throw new Error("Failed to fetch users");
  }

  return payload.data;
}

const GetAllUsers = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const debouncedValue = useMirror("debouncedValue");
  const isActiveFilter = useMirror("isActiveFilter");
  const roleFilter = useMirror("roleFilter");
  const sortBy = useMirror("sortBy");
  const sortDesc = useMirror("sortDesc");
  const { data, isPending, refetch } = useQuery({
    queryKey: [
      "users",
      pageNumber,
      debouncedValue,
      isActiveFilter,
      roleFilter,
      sortBy,
      sortDesc,
    ],
    queryFn: () =>
      getAllUsers({
        pageNumber,
        search: debouncedValue,
        isActive: isActiveFilter,
        role: roleFilter,
        sortBy,
        sortDesc,
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("usersData", data ?? {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchUsers", () => {
    void refetch();
  });

  return props;
};

export { GetAllUsers };
