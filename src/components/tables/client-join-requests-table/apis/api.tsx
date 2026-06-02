"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllClientJoinRequests } from "./get-all-requests";
import { ClientJoinRequestMutations } from "./mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetAllClientJoinRequests, ClientJoinRequestMutations)(props);

export { Api };
