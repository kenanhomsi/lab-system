"use client";

import { PropsWithChildren } from "react";
import { GetAllRoles } from "./get-all-roles";
import { RoleMutations } from "./role-mutations";

const Api = ({ children }: PropsWithChildren) => (
  <GetAllRoles>
    <RoleMutations>{children}</RoleMutations>
  </GetAllRoles>
);

export { Api };
