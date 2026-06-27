"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";
import type { ProfileTab } from "./store/state";

type StateProps = PropsWithChildren<{
  initialTab?: ProfileTab;
}>;

const State = ({ children, initialTab = "profile" }: StateProps) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  useMirrorRegistry("activeTab", activeTab);
  useMirrorRegistry("setActiveTab", setActiveTab);

  return <>{children}</>;
};

export { State };
