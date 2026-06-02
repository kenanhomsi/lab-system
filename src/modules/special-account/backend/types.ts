import type {
  CreateExpenseInput,
  CreatePaymentInput,
  CreateTaskInput,
  PatchTaskInput,
} from "../abstraction/schemas";

export type WithToken = { token: string };

export type DateRangeQuery = WithToken & {
  query?: { from?: string; to?: string };
};

export type CreatePaymentParams = WithToken & CreatePaymentInput;
export type CreateExpenseParams = WithToken & CreateExpenseInput;
export type CreateTaskParams = WithToken & CreateTaskInput;
export type PatchTaskParams = WithToken & { id: string; body: PatchTaskInput };
export type DeleteTaskParams = WithToken & { id: string };
