"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getVacantJobsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.vacantJobs");
  const schema = getVacantJobsColumns((key: string) => t(key as never));
  useMirrorRegistry("schema", schema);

  return <>{children}</>;
};

export { Schema };
