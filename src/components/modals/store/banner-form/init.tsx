"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, banner, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("banner", banner);

  return <>{children}</>;
};

export { Init };
