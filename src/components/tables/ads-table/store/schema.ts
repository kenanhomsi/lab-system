import type { DataTableColumn } from "@/components/tables/roles-table/schema/types";
import type { AdItem } from "../types";

type Params = {
  schema: DataTableColumn<AdItem>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
