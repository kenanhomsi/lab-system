import { z } from "zod";
import { TestResultItemSchema } from "./find-one";

export const sharedCreateSchema = z.union([
  TestResultItemSchema,
  z.object({ data: TestResultItemSchema }),
]);

export type SharedCreateTypeSchema = z.infer<typeof sharedCreateSchema>;
