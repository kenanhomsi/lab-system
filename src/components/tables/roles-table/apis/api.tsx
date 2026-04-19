"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllRoles } from "./get-all-roles";
import { RoleMutations } from "./role-mutations";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllRoles, RoleMutations)(props);
  return <>{children}</>;
};

export { Api };
