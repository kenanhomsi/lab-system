"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getAvailabilityColumns } from "./columns";

/**
 * Registers the availabilities table schema.
 */
const SchemaForAvailabilities = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.availabilities");
  const schema = useMemo(() => getAvailabilityColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { SchemaForAvailabilities };
