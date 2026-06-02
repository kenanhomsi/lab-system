"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
