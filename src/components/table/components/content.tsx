"use client";

import { ReactNode } from "react";
import { useMirrorRegistry } from "../store";
type ContentProps = {
  children: (recordId: string) => ReactNode;
};
const Content = (props: ContentProps) => {
  const { children } = props;
  useMirrorRegistry("ContentComp", children);
  return <div />;
};

export { Content };
