"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const Header = (props: PropsWithChildren) => {
  const { children } = props;
  useMirrorRegistry("headerComp", children);
  return <div />;
};

export { Header };
