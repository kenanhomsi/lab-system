"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getTestResultsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.testResults");
  const schema = getTestResultsColumns((key: string) => t(key as never));
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { Schema };
