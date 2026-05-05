import { infer as infer_ } from "zod";
import { sharedCreateSchema } from "../../abstraction";

const transformer = sharedCreateSchema.transform((payload) =>
  "data" in payload ? payload.data : payload,
);

type CreateBackUserSchemaType = infer_<typeof transformer>;

export { transformer as createBackUserSchema };
export type { CreateBackUserSchemaType };
