"use client";

import { PropsWithChildren } from "react";
import { FactoryProps } from "./types";
import { useMirrorRegistry } from "./store";

const Init = ({ children, isOpen, onClose, appointment }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("appointment", appointment);
  return <>{children}</>;
};

export { Init };
