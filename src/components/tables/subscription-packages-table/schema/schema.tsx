"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getSubscriptionPackageColumns } from "./columns";

const SchemaForSubscriptionPackages = (props: PropsWithChildren) => {
  const t = useTranslations("admin.subscriptions");
  const tc = useTranslations("admin.common");
  const schema = getSubscriptionPackageColumns(t, tc);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForSubscriptionPackages };
