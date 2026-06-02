import { z } from "zod";
import { VacantJobItemSchema } from "./find-one";

export const sharedUpdateSchema = z.union([
  VacantJobItemSchema,
  z.object({ data: VacantJobItemSchema }),
]);

export type SharedUpdateTypeSchema = z.infer<typeof sharedUpdateSchema>;
