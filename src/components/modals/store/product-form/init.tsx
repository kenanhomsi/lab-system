"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, product, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("product", product);

  return <>{children}</>;
};

export { Init };
