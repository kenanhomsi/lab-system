import { PermissionItem } from "../types";

type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

export type { DataTableColumn, PermissionItem as PermissionsTableRow };
