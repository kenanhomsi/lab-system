import { z } from "zod";
import { TestRequestItemSchema } from "./find-one";

export const testRequestItemSchema = TestRequestItemSchema;

export const sharedUpdateSchema = z.union([
  testRequestItemSchema,
  z.object({ data: testRequestItemSchema }),
]);

export type SharedUpdateTypeSchema = z.infer<typeof sharedUpdateSchema>;
