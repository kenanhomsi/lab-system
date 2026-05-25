import { z } from "zod";

const resultDataSchema = z.union([
  z.string(),
  z.record(z.string(), z.string()),
]);

export const TestResultItemSchema = z.object({
  id: z.number(),
  testRequestId: z.number(),
  testRequestCreatedByUserId: z.string().nullable().optional(),
  testRequestCreatedByName: z.string().nullable().optional(),
  testRequestCreatedByFullName: z.string().nullable().optional(),
  resultDate: z.string(),
  resultData: resultDataSchema,
  pdfUrl: z.string().nullable().optional(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export const shardFindOneSchema = TestResultItemSchema;

export type TestResultItemSchemaType = z.infer<typeof TestResultItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneTestResultSchema };
