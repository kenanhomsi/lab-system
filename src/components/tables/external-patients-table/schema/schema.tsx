"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getExternalPatientsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("externalPatients");
  useMirrorRegistry("schema", getExternalPatientsColumns((key) => t(key)));
  return <>{children}</>;
};

export { Schema };
