import type { DataTableColumn } from "../schema/types";
import type { InsuranceApprovalItem } from "../types";

type Params = {
  schema: DataTableColumn<InsuranceApprovalItem>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
