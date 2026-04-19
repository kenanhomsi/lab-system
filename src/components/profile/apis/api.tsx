"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import { GetMe } from "./get-me";
import { Mutations } from "./mutations";

const Api = (props: PropsWithChildren) => {
  const { children } = pipe(GetMe, Mutations)(props);
  return <>{children}</>;
};

export { Api };

