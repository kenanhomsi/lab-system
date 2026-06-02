import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  accessor: string;
  title: string;
  width?: string;
  render?: (row: T) => ReactNode;
};
