"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getMedicalTestCategoryColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.medicalTestCategories");
  const schema = getMedicalTestCategoryColumns((key: string) => t(key as never));
  useMirrorRegistry("schema", schema);

  return <>{children}</>;
};

export { Schema };
