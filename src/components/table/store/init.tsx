export type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};
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
});
export { store as initStore };
