import { z } from "zod";

export const chartBreakdownItemSchema = z.object({
  label: z.string(),
  count: z.number().optional(),
  value: z.number(),
});

export const timeSeriesItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
});

export const dashboardSummarySchema = z.object({
  totalUsers: z.number(),
  totalDoctors: z.number(),
  totalPatients: z.number(),
  totalLabPartners: z.number(),
  totalMedicalTests: z.number(),
  totalTestRequests: z.number(),
  totalResults: z.number(),
  completedResults: z.number(),
  totalExternalPatients: z.number(),
  totalComplaints: z.number(),
  totalTemplates: z.number(),
  totalRevenue: z.number(),
});

export const dashboardChartsSchema = z.object({
  requestStatus: z.array(chartBreakdownItemSchema),
  resultStatus: z.array(chartBreakdownItemSchema),
  testCategoryBreakdown: z.array(chartBreakdownItemSchema),
  monthlyRequests: z.array(timeSeriesItemSchema),
  monthlyRevenue: z.array(timeSeriesItemSchema),
  userRoleDistribution: z.array(chartBreakdownItemSchema),
});

export const recentTestRequestSchema = z.object({
  id: z.number(),
  requestDate: z.string(),
  status: z.string(),
  totalAmount: z.number(),
  medicalTestName: z.string(),
  doctorId: z.string().nullable(),
  labPartnerId: z.string().nullable(),
  directPatientId: z.string().nullable(),
  externalPatientName: z.string().nullable(),
});

export const recentTestResultSchema = z.object({
  id: z.number(),
  testRequestId: z.number(),
  resultDate: z.string(),
  status: z.string(),
  pdfUrl: z.string().nullable(),
  medicalTestName: z.string(),
});

export const recentComplaintSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  userId: z.string(),
  createdAt: z.string(),
});

export const dashboardScopeSchema = z.object({
  role: z.string(),
  userId: z.string(),
  isGlobalDashboard: z.boolean(),
  appliedFilters: z
    .object({
      scope: z.string(),
      patientId: z.string().optional(),
    })
    .passthrough(),
});

export const dashboardDataSchema = z.object({
  scope: dashboardScopeSchema,
  summary: dashboardSummarySchema,
  charts: dashboardChartsSchema,
  recent: z.object({
    testRequests: z.array(recentTestRequestSchema),
    testResults: z.array(recentTestResultSchema),
    complaints: z.array(recentComplaintSchema),
  }),
});

export const dashboardResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: dashboardDataSchema,
});

export type ChartBreakdownItem = z.infer<typeof chartBreakdownItemSchema>;
export type TimeSeriesItem = z.infer<typeof timeSeriesItemSchema>;
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type DashboardCharts = z.infer<typeof dashboardChartsSchema>;
export type DashboardScope = z.infer<typeof dashboardScopeSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
export type RecentTestRequest = z.infer<typeof recentTestRequestSchema>;
export type RecentTestResult = z.infer<typeof recentTestResultSchema>;
export type RecentComplaint = z.infer<typeof recentComplaintSchema>;
