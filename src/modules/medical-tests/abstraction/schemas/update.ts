import { z } from "zod";
import { MedicalTestItemSchema } from "./find-one";

export const medicalTestItemSchema = MedicalTestItemSchema;

export const sharedUpdateSchema = z.union([
  medicalTestItemSchema,
  z.object({ data: medicalTestItemSchema }),
]);

export type SharedUpdateTypeSchema = z.infer<typeof sharedUpdateSchema>;
