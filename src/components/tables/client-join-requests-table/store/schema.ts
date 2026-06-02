import type { DataTableColumn } from "../schema/types";
import type { ClientJoinRequestItem } from "../types";

type Params = {
  schema: DataTableColumn<ClientJoinRequestItem>[];
};

const store = (): Params => ({
  schema: [],
});

export { store as schemaStore };
