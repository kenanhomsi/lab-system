"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getRoleColumns } from "./columns";

const SchemaForRoles = (props: PropsWithChildren) => {
  const t = useTranslations("admin.settings.roles");
  const schema = useMemo(() => getRoleColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForRoles };
