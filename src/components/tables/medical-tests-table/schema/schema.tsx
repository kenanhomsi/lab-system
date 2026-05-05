"use client";

import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import { getMedicalTestsColumns } from "./columns";

const Schema = ({ children }: PropsWithChildren) => {
  const t = (key: string): string => {
    const labels: Record<string, string> = {
      colNameAr: "Name (Arabic)",
      colNameEn: "Name (English)",
      colCategory: "Category",
      colSampleType: "Sample Type",
      colPrice: "Price",
      tableStatus: "Status",
      colCreatedAt: "Created At",
    };
    return labels[key] ?? key;
  };
  const schema = getMedicalTestsColumns(t);
  useMirrorRegistry("schema", schema);

  return <>{children}</>;
};

export { Schema };
