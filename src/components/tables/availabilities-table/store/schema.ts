import type { DataTableColumn } from "@/components/tables/roles-table/schema/types";
import type { AvailabilityRow } from "../types";

type Params = {
  schema: DataTableColumn<AvailabilityRow>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
