import { z } from "zod";
import { VacantJobItemSchema } from "./find-one";

export const sharedCreateSchema = z.union([
  VacantJobItemSchema,
  z.object({ data: VacantJobItemSchema }),
]);

export type SharedCreateTypeSchema = z.infer<typeof sharedCreateSchema>;
