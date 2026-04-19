"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({ children, isOpen, onClose, role }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("role", role);

  return <>{children}</>;
};

export { Init };
