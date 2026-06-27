"use client";

import { PropsWithChildren } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getMedicalTestsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.medicalTests");
  const locale = useLocale();
  const schema = getMedicalTestsColumns((key: string) => t(key as never), locale);
  useMirrorRegistry("schema", schema);

  return <>{children}</>;
};

export { Schema };
