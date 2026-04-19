import { SubscriptionPackageItem } from "../types";

type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

export type { DataTableColumn, SubscriptionPackageItem as SubscriptionPackagesTableRow };
