"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetMyComplaints } from "./get-my-complaints";
import { MyComplaintsMutations } from "./my-complaints-mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetMyComplaints, MyComplaintsMutations)(props);

export { Api };
