import { z } from "zod";
import { userItemSchema } from "./find-one";

export const userSchema = userItemSchema;

export const sharedUpdateSchema = z.union([
  userSchema,
  z.object({ data: userSchema }),
]);

export type SharedUpdateTypeSchema = z.infer<typeof sharedUpdateSchema>;
