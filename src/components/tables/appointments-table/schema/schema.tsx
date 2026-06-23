"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getAppointmentColumns } from "./columns";

/**
 * Registers the blood draw appointments table schema.
 */
const SchemaForAppointments = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.bloodDrawAppointments");
  const schema = useMemo(() => getAppointmentColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { SchemaForAppointments };
