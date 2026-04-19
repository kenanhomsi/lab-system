"use client";

import { PropsWithChildren } from "react";
import { FactoryProps } from "./types";
import { useMirrorRegistry } from "./store";

const Init = ({ children, isOpen, onClose }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("initDone", true);
  return <>{children}</>;
};

export { Init };
