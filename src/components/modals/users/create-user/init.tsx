"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);

  return <>{children}</>;
};

export { Init };
