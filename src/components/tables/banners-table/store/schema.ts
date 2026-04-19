type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: DataTableColumn<any>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { DataTableColumn, Params as schemaParams };
