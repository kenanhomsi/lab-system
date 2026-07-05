"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { DashboardData } from "./type";
import type { SlideCardItem } from "@/types/slide-card";

type Props = PropsWithChildren<{
  dashboard: DashboardData | null;
  slideCards: SlideCardItem[];
}>;

const Init = ({ children, dashboard, slideCards }: Props) => {
  useMirrorRegistry("dashboard", dashboard);
  useMirrorRegistry("slideCards", slideCards);
  return <>{children}</>;
};

export default Init;
