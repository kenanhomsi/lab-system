import type { DataTableColumn } from "../schema/types";
import type { ContractServiceRequestItem } from "../types";

type Params = {
  schema: DataTableColumn<ContractServiceRequestItem>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
