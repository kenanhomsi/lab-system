"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { ComplaintsMutations } from "./complaints-mutations";
import { GetAllComplaints } from "./get-all-complaints";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllComplaints, ComplaintsMutations)(props);
  return <>{children}</>;
};

export { Api };
