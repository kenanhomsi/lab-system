"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, category, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("category", category);

  return <>{children}</>;
};

export { Init };
