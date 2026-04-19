"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllPermissions } from "./get-all-permissions";
import { PermissionMutations } from "./permission-mutations";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllPermissions, PermissionMutations)(props);
  return <>{children}</>;
};

export { Api };
