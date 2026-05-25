"use client";

import { frontendContainer } from "@/container";
import {
  accessPolicyModuleNames,
  AccessPolicyFrontendService,
} from "@/modules/access-policy";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { AccessPoliciesResponse } from "../types";

const accessPolicyService = frontendContainer.get<AccessPolicyFrontendService>(
  accessPolicyModuleNames.service,
);

async function getAllAccessPolicies(params: {
  pageNumber: number;
}): Promise<AccessPoliciesResponse> {
  const query: Record<string, string> = {
    Page: String(params.pageNumber),
    PageSize: "100",
  };
  const payload = await accessPolicyService.findAll({ query });
  return Array.isArray(payload) ? payload : [];
}

const GetAllAccessPolicies = (props: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-access-policies", pageNumber],
    queryFn: () => getAllAccessPolicies({ pageNumber }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("policiesData", data ?? []);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAccessPolicies", () => {
    void refetch();
  });

  return <>{props.children}</>;
};

export { GetAllAccessPolicies };
