"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getTestResultsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = (key: string): string =>
    ({
      colId: "ID",
      colTestRequestId: "Test Request ID",
      colResultDate: "Result Date",
      colResultData: "Result Data",
      colPdfUrl: "PDF URL",
      tableStatus: "Status",
      colCreatedAt: "Created At",
    })[key] ?? key;

  useMirrorRegistry("schema", getTestResultsColumns(t));
  return <>{children}</>;
};

export { Schema };
