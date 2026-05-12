"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { AccessPolicyMutations } from "./access-policy-mutations";
import { GetAllAccessPolicies } from "./get-all-access-policies";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllAccessPolicies, AccessPolicyMutations)(props);
  return <>{children}</>;
};

export { Api };
