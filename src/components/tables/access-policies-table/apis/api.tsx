"use client";

import { PropsWithChildren } from "react";
import { AccessPolicyMutations } from "./access-policy-mutations";
import { GetAllAccessPolicies } from "./get-all-access-policies";

const Api = ({ children }: PropsWithChildren) => (
  <GetAllAccessPolicies>
    <AccessPolicyMutations>{children}</AccessPolicyMutations>
  </GetAllAccessPolicies>
);

export { Api };
