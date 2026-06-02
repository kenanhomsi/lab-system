"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllEmploymentApplications } from "./get-all";
import { EmploymentApplicationsMutations } from "./mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetAllEmploymentApplications, EmploymentApplicationsMutations)(props);

export { Api };