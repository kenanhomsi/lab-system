"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, slider, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("slider", slider);

  return <>{children}</>;
};

export { Init };
