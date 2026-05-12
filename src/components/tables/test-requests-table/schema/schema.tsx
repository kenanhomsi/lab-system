"use client";

import { useSessionUserStore } from "@/stores/session-user-store";
import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getTestRequestsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.testRequests");
  const roles = useSessionUserStore((s) => s.user?.roles);

  const schema = getTestRequestsColumns(
    (key: string) => t(key as never),
    { roles },
  );
  useMirrorRegistry("schema", schema);
  return <>{children}</>;
};

export { Schema };
