"use client";

import { pipe } from "ramda";
import { PropsWithChildren } from "react";
import OnDragEnd from "./handle-next-step";

const Utils = (props: PropsWithChildren) => {
  const { children } = pipe(OnDragEnd)(props);

  return <>{children}</>;
};

export { Utils };
