"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getAccessPolicyColumns } from "./columns";

const SchemaForAccessPolicies = (props: PropsWithChildren) => {
  const t = useTranslations("admin.settings.accessPolicies");
  const schema = useMemo(() => getAccessPolicyColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForAccessPolicies };
