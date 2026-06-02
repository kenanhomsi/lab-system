"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { getStoreBannersColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const schema = getStoreBannersColumns((key: string) => t(key as never));
  useMirrorRegistry("schema", schema);

  return <>{children}</>;
};

export { Schema };
