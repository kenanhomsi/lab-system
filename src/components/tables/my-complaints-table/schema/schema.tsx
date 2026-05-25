"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getMyComplaintsColumns } from "./columns";

const SchemaForMyComplaints = (props: PropsWithChildren) => {
  const t = useTranslations("myComplaints");
  const schema = getMyComplaintsColumns(t);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForMyComplaints };
