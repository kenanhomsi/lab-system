"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getAppointmentsColumns } from "./columns";
import { SchemaParams } from "../store/schema";

const SchemaForAppointments = (props: PropsWithChildren) => {
  const t = useTranslations("admin.appointments");
  const schema = getAppointmentsColumns(t) as SchemaParams["schema"];
  useMirrorRegistry("schema", schema);
  return <>{props.children}</>;
};

export { SchemaForAppointments };
