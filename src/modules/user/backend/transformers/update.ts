import { sharedUpdateSchema } from "../../abstraction";
import { infer as infer_ } from "zod";

const schema = sharedUpdateSchema;

const transformer = schema.transform((payload) =>
  "data" in payload ? payload.data : payload,
);

type UpdateBackUserSchemaType = infer_<typeof transformer>;

export { transformer as updateBackUserSchema };
export type { UpdateBackUserSchemaType };
