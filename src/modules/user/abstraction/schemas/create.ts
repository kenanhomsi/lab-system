import { z } from "zod";
import { userItemSchema } from "./find-one";

export const sharedCreateSchema = z.union([
  userItemSchema,
  z.object({ data: userItemSchema }),
]);

export type SharedCreateTypeSchema = z.infer<typeof sharedCreateSchema>;
