import type { DataTableColumn } from "@/components/table/store/init";
import type { MedicalTestCategory } from "@/modules/medical-test-categories";

type Params = {
  schema: DataTableColumn<MedicalTestCategory>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
export type { Params as schemaParams };
