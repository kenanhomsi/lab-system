"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";

const Init = ({
  children,
  isOpen,
  onClose,
  appointmentType,
}: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("appointmentType", appointmentType);

  return <>{children}</>;
};

export { Init };
