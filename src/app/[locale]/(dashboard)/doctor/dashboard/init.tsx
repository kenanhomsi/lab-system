"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { DashboardData } from "./type";

type Props = PropsWithChildren<{
  dashboard: DashboardData | null;
}>;

const Init = ({ children, dashboard }: Props) => {
  useMirrorRegistry("dashboard", dashboard);
  return <>{children}</>;
};

export default Init;
