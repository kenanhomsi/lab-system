import { z } from "zod";
import { MedicalTestItemSchema } from "./find-one";

export const sharedCreateSchema = z.union([
  MedicalTestItemSchema,
  z.object({ data: MedicalTestItemSchema }),
]);

export type SharedCreateTypeSchema = z.infer<typeof sharedCreateSchema>;
