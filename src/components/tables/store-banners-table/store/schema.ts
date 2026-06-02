import type { DataTableColumn } from "@/components/table/store/init";

type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: DataTableColumn<any>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
