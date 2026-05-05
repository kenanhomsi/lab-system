import { z } from "zod";

const parameterPrimitiveSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const parameterSchemaFieldSchema = z.object({
  key: z.string(),
  value: parameterPrimitiveSchema.optional(),
  label: z.string().optional(),
  type: z.string().optional(),
  unit: z.string().optional(),
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string()).optional(),
});

const parameterSchemaSchema = z.union([
  z.string(),
  z.record(z.string(), parameterPrimitiveSchema),
  z.array(parameterSchemaFieldSchema),
]);

export const MedicalTestItemSchema = z.object({
  id: z.string(),
  nameAr: z.string(),
  nameEn: z.string(),
  price: z.number(),
  category: z.string(),
  sampleType: z.string(),
  parameterSchema: parameterSchemaSchema,
  status: z.string(),
  createdByUserId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export const shardFindOneSchema = MedicalTestItemSchema;

export type UserItemSchemaType = z.infer<typeof MedicalTestItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneUserSchema };
