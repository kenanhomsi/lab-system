import type { DataTableColumn } from "@/components/table/store/init";
import type { EmploymentApplicationItem } from "../types";

type Params = {
  schema: DataTableColumn<EmploymentApplicationItem>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
