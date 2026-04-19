"use client";

import { useMirror as useTableMirror } from "@/components/tables/subscription-packages-table/store";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const Api = ({ children }: PropsWithChildren) => {
  const audienceOptions = useTableMirror("audienceOptions");
  const createPackageApi = useTableMirror("createPackage");
  const updatePackageApi = useTableMirror("updatePackage");

  useMirrorRegistry("audienceOptions", audienceOptions);
  useMirrorRegistry("createPackageApi", createPackageApi);
  useMirrorRegistry("updatePackageApi", updatePackageApi);

  return <>{children}</>;
};

export { Api };
