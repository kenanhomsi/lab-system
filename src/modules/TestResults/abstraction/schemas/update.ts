import { z } from "zod";
import { TestResultItemSchema } from "./find-one";

export const testResultItemSchema = TestResultItemSchema;

export const sharedUpdateSchema = z.union([
  testResultItemSchema,
  z.object({ data: testResultItemSchema }),
  z.null(),
]);

export type SharedUpdateTypeSchema = z.infer<typeof sharedUpdateSchema>;
