import { z } from "zod";

const parameterSchemaValue = z.union([
  z.string(),
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
]);

export const TestRequestTestItemSchema = z.object({
  testRequestId: z.number(),
  medicalTestId: z.number(),
  medicalTestNameEn: z.string().nullable().optional(),
  parameterSchema: parameterSchemaValue.nullable().optional(),
  parameters: z.array(z.unknown()).optional(),
});

export const TestRequestItemSchema = z.object({
  id: z.number(),
  medicalTestId: z.number().optional(),
  testRequestIds: z.array(z.number()).optional(),
  tests: z.array(TestRequestTestItemSchema).optional(),
  medicalTestNameEn: z.string().nullable().optional(),
  requestDate: z.string(),
  status: z.string(),
  totalAmount: z.number(),
  notes: z.union([z.string(), z.null()]).optional(),
  metadata: z.union([z.string(), z.null()]).optional(),
  doctorId: z.union([z.string(), z.number(), z.null()]).optional(),
  doctorName: z.string().nullable().optional(),
  labClientId: z.union([z.string(), z.null()]).optional(),
  labPartnerName: z.string().nullable().optional(),
  directPatientId: z.union([z.string(), z.null()]).optional(),
  patientName: z.string().nullable().optional(),
  externalPatientId: z.number().nullable().optional(),
  externalPatientFullName: z.string().nullable().optional(),
  createdByUserId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.union([z.string(), z.null()]).optional(),
  resultId: z.number().optional(),
});

export const shardFindOneSchema = TestRequestItemSchema;

export type TestRequestItemSchemaType = z.infer<typeof TestRequestItemSchema>;
export type ShardFindOneTypeSchema = z.infer<typeof shardFindOneSchema>;
export { shardFindOneSchema as findOneTestRequestSchema };
