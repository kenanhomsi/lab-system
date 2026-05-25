import { z } from "zod";
import { TestRequestItemSchema } from "./find-one";

export const sharedCreateSchema = z.union([
  z.array(TestRequestItemSchema),
  z.object({ data: z.array(TestRequestItemSchema) }),
]);

export type SharedCreateTypeSchema = z.infer<typeof sharedCreateSchema>;
