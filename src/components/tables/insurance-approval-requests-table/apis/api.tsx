"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllInsuranceApprovalRequests } from "./get-all-requests";
import { InsuranceApprovalMutations } from "./mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetAllInsuranceApprovalRequests, InsuranceApprovalMutations)(props);

export { Api };
