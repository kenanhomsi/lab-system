import { z } from "zod";

export const TestRequestItemSchema = z.object({
    id: z.number(),
      medicalTestId: z.number(),
      medicalTestNameEn: z.string(),
      requestDate: z.string(),
      status: z.string(),
      totalAmount: z.number(),
      notes: z.string(),
      metadata: z.string(),
      doctorId: z.union([z.string(), z.null()]),
      labClientId: z.union([z.string(), z.null()]),
      directPatientId: z.union([z.string(), z.null()]),
      externalPatientId: z.number().nullable().optional(),
      createdByUserId: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
      resultId: z.number().optional(),
});

export const shardFindOneSchema = TestRequestItemSchema;

export type TestRequestItemSchemaType = z.infer<typeof TestRequestItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneTestRequestSchema };
