"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllContractServiceRequests } from "./get-all-requests";
import { ContractServiceRequestMutations } from "./mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetAllContractServiceRequests, ContractServiceRequestMutations)(props);

export { Api };
