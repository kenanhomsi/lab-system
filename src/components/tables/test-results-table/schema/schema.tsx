"use client";

import { useSessionUserStore } from "@/stores/session-user-store";
import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getTestResultsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.testResults");
  const roles = useSessionUserStore((s) => s.user?.roles);
  const schema = getTestResultsColumns((key: string) => t(key as never), { roles });
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { Schema };
