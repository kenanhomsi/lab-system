"use client";

import { frontendContainer } from "@/container";
import { roleModuleNames, RoleFrontendService } from "@/modules/role";
import { CreateUserCommand, userModuleNames } from "@/modules/user";
import { useQuery } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { CreateUserPayload } from "./types";
import { RoleOption } from "./store/api";

const createUserCommand = frontendContainer.get<CreateUserCommand>(
  userModuleNames.createUserCommand,
);
const roleService = frontendContainer.get<RoleFrontendService>(roleModuleNames.service);

const Api = ({ children }: PropsWithChildren) => {
  const { data: roleOptions = [], isPending: isLoadingRoles } = useQuery({
    queryKey: ["admin-role-options"],
    queryFn: async (): Promise<RoleOption[]> => {
      const payload = await roleService.findAll({
        query: { Page: "1", PageSize: "100" },
      });
      console.log(payload)
      const roleItems = Array.isArray(payload?.items)
        ? payload?.items
        : Array.isArray((payload?.items as { data?: unknown[] } | undefined)?.data)
          ? ((payload?.items as { data?: unknown[] }).data ?? [])
          : [];
      const rows = roleItems as { name?: string }[];
      return rows.map((role) => ({
        value: role.name ?? "",
        label: role.name ?? "",
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useManagedMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      createUserCommand.init(payload);
      return createUserCommand.exec();
    },
  });

  useMirrorRegistry("submitCreate", async (payload: CreateUserPayload) =>
    createMutation.mutateAsync(payload),
  );
  useMirrorRegistry("roleOptions", roleOptions);
  useMirrorRegistry("isLoadingRoles", isLoadingRoles);

  return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
