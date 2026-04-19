"use client";

import { PropsWithChildren } from "react";
import { navbarConfig } from "./type";
import { useMirrorRegistry } from "./store";

const Init = (props: PropsWithChildren<{ config: navbarConfig }>) => {
  const { children, config } = props;
  useMirrorRegistry("config", config);

  return <>{children}</>;
};

export default Init;
