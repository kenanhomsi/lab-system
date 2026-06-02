import { z } from "zod";

export const lookupItemSchema = z.object({
  id: z.string(),
  labelEn: z.string(),
  labelAr: z.string(),
});

export const specialPaymentSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  description: z.string(),
  note: z.string(),
  createdAt: z.string(),
});

export const specialExpenseSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  expenseType: z.string(),
  note: z.string(),
  createdAt: z.string(),
});

export const accountStatementSchema = z.object({
  payments: z.array(specialPaymentSchema),
  expenses: z.array(specialExpenseSchema),
  totalPayments: z.number(),
  totalExpenses: z.number(),
  balance: z.number(),
});

export const dailyTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  dueTime: z.string(),
  reminderEnabled: z.boolean(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const createPaymentSchema = z.object({
  date: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().min(1),
  note: z.string().optional().default(""),
});

export const createExpenseSchema = z.object({
  date: z.string().min(1),
  amount: z.number().positive(),
  expenseType: z.string().min(1),
  note: z.string().optional().default(""),
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  dueDate: z.string().min(1),
  dueTime: z.string().optional().default(""),
  reminderEnabled: z.boolean().optional().default(false),
});

export const patchTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type LookupItem = z.infer<typeof lookupItemSchema>;
export type SpecialPayment = z.infer<typeof specialPaymentSchema>;
export type SpecialExpense = z.infer<typeof specialExpenseSchema>;
export type AccountStatement = z.infer<typeof accountStatementSchema>;
export type DailyTask = z.infer<typeof dailyTaskSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type PatchTaskInput = z.infer<typeof patchTaskSchema>;
