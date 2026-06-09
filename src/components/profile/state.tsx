"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import type { ProfileTab } from "./store/state";

const State = ({ children }: PropsWithChildren) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  useMirrorRegistry("activeTab", activeTab);
  useMirrorRegistry("setActiveTab", setActiveTab);

  return <>{children}</>;
};

export { State };
