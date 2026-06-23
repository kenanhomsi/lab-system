"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getAdColumns } from "./columns";

/**
 * Registers the ads table schema.
 */
const SchemaForAds = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.settings.ads");
  const schema = useMemo(() => getAdColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { SchemaForAds };
