"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getColumns } from "./columns";

const SchemaForInsuranceApproval = (props: PropsWithChildren) => {
  const t = useTranslations("admin.insuranceApproval");
  const schema = getColumns(t);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForInsuranceApproval };
