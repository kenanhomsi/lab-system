type DataTableColumn<T> = {
  accessor: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

type Params = {
  schema: DataTableColumn<unknown>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { DataTableColumn, Params as SchemaParams };
