import { infer as infer_ } from "zod";
import { sharedFindAllSchema } from "../../abstraction";

const transformer = sharedFindAllSchema.transform((payload) => payload);

type FindAllBackUserSchemaType = infer_<typeof transformer>;

export { transformer as findAllBackUserSchema };
export type { FindAllBackUserSchemaType };
