import { z } from "zod";

export const accountingSettingsSchema = z.object({
  id: z.number(),
  announcementTextAr: z.string(),
  announcementTextEn: z.string(),
  titleAr: z.string(),
  titleEn: z.string(),
  descriptionAr: z.string(),
  descriptionEn: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const statementRowSchema = z.object({
  requestDate: z.string(),
  testRequestId: z.number(),
  patientName: z.string(),
  testNameAr: z.string(),
  testNameEn: z.string(),
  testPrice: z.number(),
  paymentsApplied: z.number(),
});

export const statementTotalsSchema = z.object({
  totalTestsAmount: z.number(),
  totalPayments: z.number(),
  remainingAmount: z.number(),
  previousBalance: z.number(),
  balanceUntilPeriodEnd: z.number(),
});

export const statementChartPointSchema = z.object({
  label: z.string(),
  testsAmount: z.number(),
  paymentsAmount: z.number(),
  remainingAmount: z.number(),
});

export const statementAnalysisSchema = z.object({
  testsCount: z.number(),
  distinctPatientsCount: z.number(),
  averageTestPrice: z.number(),
  paymentCoveragePercentage: z.number(),
  highestRevenueTestName: z.string(),
  highestRevenueTestAmount: z.number(),
});

export const uploadedStatementFileSchema = z.object({
  id: z.number(),
  labClientId: z.string(),
  labName: z.string(),
  periodFrom: z.string(),
  periodTo: z.string(),
  fileUrl: z.string(),
  originalFileName: z.string(),
  notes: z.string(),
  createdAt: z.string(),
});

export const accountingStatementSchema = z.object({
  settings: accountingSettingsSchema,
  labClientId: z.string(),
  labName: z.string(),
  periodFrom: z.string(),
  periodTo: z.string(),
  labOutstandingBalance: z.number(),
  rows: z.array(statementRowSchema),
  totals: statementTotalsSchema,
  chart: z.array(statementChartPointSchema),
  analysis: statementAnalysisSchema,
  uploadedFiles: z.array(uploadedStatementFileSchema),
});

export const accountingPaymentSchema = z.object({
  id: z.number(),
  labClientId: z.string(),
  labName: z.string(),
  amount: z.number(),
  paidAt: z.string(),
  paymentMethod: z.string(),
  referenceNumber: z.string(),
  notes: z.string(),
  createdAt: z.string(),
});

export const paginatedPaymentsSchema = z.object({
  items: z.array(accountingPaymentSchema),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const updateAccountingSettingsSchema = z.object({
  announcementTextAr: z.string(),
  announcementTextEn: z.string(),
  titleAr: z.string(),
  titleEn: z.string(),
  descriptionAr: z.string(),
  descriptionEn: z.string(),
  isActive: z.boolean(),
});

export const createPaymentSchema = z.object({
  labClientId: z.string().min(1),
  amount: z.number().positive(),
  paidAt: z.string().min(1),
  paymentMethod: z.string().min(1),
  referenceNumber: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export const updatePaymentSchema = createPaymentSchema;

export type AccountingSettings = z.infer<typeof accountingSettingsSchema>;
export type AccountingStatement = z.infer<typeof accountingStatementSchema>;
export type AccountingPayment = z.infer<typeof accountingPaymentSchema>;
export type PaginatedPayments = z.infer<typeof paginatedPaymentsSchema>;
export type UpdateAccountingSettingsInput = z.infer<
  typeof updateAccountingSettingsSchema
>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
