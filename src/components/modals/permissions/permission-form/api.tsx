"use client";

import { useMirror as useTableMirror } from "@/components/tables/permissions-table/store";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const createPermissionApi = useTableMirror("createPermission");
  const updatePermissionApi = useTableMirror("updatePermission");

  useMirrorRegistry("createPermissionApi", createPermissionApi);
  useMirrorRegistry("updatePermissionApi", updatePermissionApi);

  return <>{children}</>;
};

export { Api };
