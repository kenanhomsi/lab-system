"use client";

import { useMirror as useTableMirror } from "@/components/tables/roles-table/store";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const createRoleApi = useTableMirror("createRole");
  const updateRoleApi = useTableMirror("updateRole");

  useMirrorRegistry("createRoleApi", createRoleApi);
  useMirrorRegistry("updateRoleApi", updateRoleApi);

  return <>{children}</>;
};

export { Api };
