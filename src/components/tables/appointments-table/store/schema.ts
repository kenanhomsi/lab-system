import type { DataTableColumn } from "@/components/tables/roles-table/schema/types";
import type { AppointmentRow } from "../types";

type Params = {
  schema: DataTableColumn<AppointmentRow>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
