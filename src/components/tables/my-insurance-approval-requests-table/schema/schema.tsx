"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getColumns } from "./columns";

const SchemaForMyInsuranceApproval = (props: PropsWithChildren) => {
  const t = useTranslations("myInsuranceApproval");
  const schema = getColumns(t);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForMyInsuranceApproval };
