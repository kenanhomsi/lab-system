"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">(
    "profile",
  );

  useMirrorRegistry("activeTab", activeTab);
  useMirrorRegistry("setActiveTab", setActiveTab);

  return <>{children}</>;
};

export { State };

