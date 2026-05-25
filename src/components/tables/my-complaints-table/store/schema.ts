import { DataTableColumn } from "../schema/types";
import { ComplaintItem } from "../types";

type Params = {
  schema: DataTableColumn<ComplaintItem>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
