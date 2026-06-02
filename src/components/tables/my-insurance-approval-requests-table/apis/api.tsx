"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetMyInsuranceApprovalRequests } from "./get-my-requests";
import { MyInsuranceApprovalMutations } from "./mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetMyInsuranceApprovalRequests, MyInsuranceApprovalMutations)(props);

export { Api };
