"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getComplaintsColumns } from "./columns";

const SchemaForComplaints = (props: PropsWithChildren) => {
  const t = useTranslations("admin.complaints");
  const schema = getComplaintsColumns(t);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForComplaints };
