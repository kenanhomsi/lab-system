import { findOneUserSchema } from "../../abstraction";
import { infer as infer_ } from "zod";
import { z } from "zod";

const schema = z.union([findOneUserSchema, z.object({ data: findOneUserSchema })]);

const transformer = schema.transform((payload) =>
  "data" in payload ? payload.data : payload,
);

type FindOneBackUserSchemaType = infer_<typeof transformer>;

export { transformer as findOneBackUserSchema };
export type { FindOneBackUserSchemaType };
