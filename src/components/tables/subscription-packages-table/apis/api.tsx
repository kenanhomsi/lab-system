"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllPackages } from "./get-all-packages";
import { PackageMutations } from "./package-mutations";

const Api = (props: PropsWithChildren) =>
  pipe(GetAllPackages, PackageMutations)(props);

export { Api };
