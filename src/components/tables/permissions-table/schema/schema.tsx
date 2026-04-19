"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getPermissionColumns } from "./columns";

const SchemaForPermissions = (props: PropsWithChildren) => {
  const t = useTranslations("admin.settings.permissions");
  const schema = useMemo(() => getPermissionColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForPermissions };
