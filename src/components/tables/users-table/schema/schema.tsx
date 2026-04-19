"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getUsersColumns } from "./columns";

const SchemaForUsers = (props: PropsWithChildren) => {
  const t = useTranslations("admin.users");
  const tc = useTranslations("admin.common");
  const schema = getUsersColumns(t, tc);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForUsers };
