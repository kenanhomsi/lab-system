"use client";

import { PropsWithChildren, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getAppointmentTypeColumns } from "./columns";

const SchemaForAppointmentTypes = (props: PropsWithChildren) => {
  const t = useTranslations("admin.settings.appointmentTypes");
  const schema = useMemo(() => getAppointmentTypeColumns(t as (key: string) => string), [t]);
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForAppointmentTypes };
