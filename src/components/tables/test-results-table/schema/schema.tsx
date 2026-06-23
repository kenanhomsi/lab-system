"use client";

import { useSessionUserStore } from "@/stores/session-user-store";
import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirror, useMirrorRegistry } from "../store";
import { getTestResultsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.testResults");
  const roles = useSessionUserStore((s) => s.user?.roles);
  const selectedIds = useMirror("selectedTestResultIds");
  const setSelectedIds = useMirror("setSelectedTestResultIds");
  const testResultsData = useMirror("testResultsData");
  const schema = getTestResultsColumns((key: string) => t(key as never), {
    roles,
    selectedIds,
    visibleRows: testResultsData.items,
    onSelectedIdsChange: setSelectedIds,
  });
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { Schema };
