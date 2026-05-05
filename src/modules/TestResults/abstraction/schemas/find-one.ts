import { z } from "zod";

export const TestResultItemSchema = z.object({
  id: z.number(),
  testRequestId: z.number(),
  resultDate: z.string(),
  resultData: z.string(),
  pdfUrl: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const shardFindOneSchema = TestResultItemSchema;

export type TestResultItemSchemaType = z.infer<typeof TestResultItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneTestResultSchema };
