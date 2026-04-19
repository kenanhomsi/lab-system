import { object, string, infer as infer_ } from "zod";

const schema = object({
  message: string(),
});

type RegisterSchemaType = infer_<typeof schema>;

export { schema as registerSchema };
export type { RegisterSchemaType };
