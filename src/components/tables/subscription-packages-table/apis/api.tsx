"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetAllPackages } from "./get-all-packages";
import { PackageMutations } from "./package-mutations";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetAllPackages, PackageMutations)(props);
  return <>{children}</>;
};

export { Api };
