import { z } from "zod";
import { TestRequestItemSchema } from "./find-one";

export const sharedCreateSchema = z.union([
  TestRequestItemSchema,
  z.object({ data: TestRequestItemSchema }),
]);

export type SharedCreateTypeSchema = z.infer<typeof sharedCreateSchema>;
