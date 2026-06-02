"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getColumns } from "./columns";

const SchemaForClientJoinRequests = (props: PropsWithChildren) => {
  const t = useTranslations("admin.clientJoinRequests");
  const schema = getColumns(t);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForClientJoinRequests };
