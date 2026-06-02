"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { FactoryProps } from "./types";

const Init = ({ isOpen, onClose, coupon, children }: PropsWithChildren<FactoryProps>) => {
  useMirrorRegistry("isOpen", isOpen);
  useMirrorRegistry("onClose", onClose);
  useMirrorRegistry("coupon", coupon);

  return <>{children}</>;
};

export { Init };
