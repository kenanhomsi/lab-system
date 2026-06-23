import { TestResultItem } from "../types";

type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: React.ReactNode;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

export type { DataTableColumn, TestResultItem as TestResultsTableRow };
