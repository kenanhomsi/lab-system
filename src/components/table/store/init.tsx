import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => ReactNode;
};

export type DataTableClassNames = {
  header?: string;
  root?: string;
};

/** Mantine `DataTable` spacing tokens */
export type DataTableSpacing = "xs" | "sm" | "md" | "lg" | "xl";

type Params = {
  OnPageNumberChange: (value: number) => void;
  paginationStatic: { page: number; limit: number; count: number };
  type: "normal" | "expansion" | "isLoading";
  expandedRowIds?: string[];
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  schema: DataTableColumn<any>[];
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
  withDrag?: boolean;
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  onReorder?: (data: any[]) => void;
  onRowClick?: (id: string) => void;
  tableEmptyState?: ReactNode;
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  tableRowClassName?: (record: any) => string;
  dataTableClassNames?: DataTableClassNames;
  tableStriped?: boolean;
  tableHighlightOnHover?: boolean;
  dataTableVerticalSpacing?: DataTableSpacing;
  dataTableHorizontalSpacing?: DataTableSpacing;
};

const store = (): Params => ({
  OnPageNumberChange: () => {},
  paginationStatic: { page: 1, limit: 5, count: 1 },
  type: "normal",
  expandedRowIds: [],
  schema: [],
  data: [],
  isLoading: false,
  onRowClick: () => {},
  tableEmptyState: undefined,
  tableRowClassName: undefined,
  dataTableClassNames: undefined,
  tableStriped: undefined,
  tableHighlightOnHover: undefined,
  dataTableVerticalSpacing: undefined,
  dataTableHorizontalSpacing: undefined,
});
export { store as initStore };
