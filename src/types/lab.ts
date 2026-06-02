export type {
  AccountingSettings,
  AccountingStatement,
  AccountingPayment,
  PaginatedPayments,
} from "@/modules/accounting/abstraction/schemas";

/** @deprecated Use AccountingStatement from @/modules/accounting */
export interface LabAccountingEntry {
  id: string;
  labId: string;
  patientName: string;
  tests: string[];
  pricePerTest: number[];
  totalPrice: number;
  payment: number;
  date: string;
}

/** @deprecated Use AccountingStatement from @/modules/accounting */
export interface LabAccountingSummary {
  entries: LabAccountingEntry[];
  totalTestsAmount: number;
  totalPayments: number;
  balanceDue: number;
}
