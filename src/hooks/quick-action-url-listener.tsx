"use client";

import { Suspense } from "react";
import { useQuickActionFromUrl } from "./use-quick-action-from-url";

type Props = {
  modal: string;
  onOpen: () => void;
};

const QuickActionUrlListenerInner = ({ modal, onOpen }: Props) => {
  useQuickActionFromUrl(modal, onOpen);
  return null;
};

const QuickActionUrlListener = ({ modal, onOpen }: Props) => (
  <Suspense fallback={null}>
    <QuickActionUrlListenerInner modal={modal} onOpen={onOpen} />
  </Suspense>
);

export { QuickActionUrlListener };
