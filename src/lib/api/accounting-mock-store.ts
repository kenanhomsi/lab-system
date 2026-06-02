import type {
  AccountingPayment,
  AccountingSettings,
  AccountingStatement,
  PaginatedPayments,
  UpdateAccountingSettingsInput,
} from "@/modules/accounting/abstraction/schemas";

const DEFAULT_SETTINGS: AccountingSettings = {
  id: 1,
  announcementTextAr: "إعلان المحاسبة",
  announcementTextEn: "Accounting announcement",
  titleAr: "كشف حساب المخبر",
  titleEn: "Lab account statement",
  descriptionAr: "عرض التحاليل والمدفوعات والرصيد المستحق ضمن الفترة المحددة.",
  descriptionEn: "View tests, payments, and outstanding balance for the selected period.",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let settingsStore: AccountingSettings = { ...DEFAULT_SETTINGS };

const seedPayments: AccountingPayment[] = [
  {
    id: 1,
    labClientId: "lab-demo-001",
    labName: "مخبر النور",
    amount: 500,
    paidAt: "2026-05-01T10:00:00.000Z",
    paymentMethod: "Cash",
    referenceNumber: "PAY-001",
    notes: "",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: 2,
    labClientId: "lab-demo-001",
    labName: "مخبر النور",
    amount: 1200,
    paidAt: "2026-05-15T14:30:00.000Z",
    paymentMethod: "Bank Transfer",
    referenceNumber: "PAY-002",
    notes: "دفعة شهر مايو",
    createdAt: "2026-05-15T14:30:00.000Z",
  },
];

let paymentsStore = [...seedPayments];
let nextPaymentId = 3;

function inDateRange(
  isoDate: string,
  from: string | undefined,
  to: string | undefined,
): boolean {
  const day = isoDate.slice(0, 10);
  const fromDay = from?.slice(0, 10);
  const toDay = to?.slice(0, 10);
  if (fromDay && day < fromDay) return false;
  if (toDay && day > toDay) return false;
  return true;
}

export function mockAccountingGetSettings(): AccountingSettings {
  return { ...settingsStore };
}

export function mockAccountingUpdateSettings(
  body: UpdateAccountingSettingsInput,
): AccountingSettings {
  settingsStore = {
    ...settingsStore,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  return { ...settingsStore };
}

export function mockAccountingGetStatement(params: {
  labClientId: string;
  from?: string;
  to?: string;
}): AccountingStatement {
  const periodFrom = params.from ?? new Date(Date.now() - 30 * 86400000).toISOString();
  const periodTo = params.to ?? new Date().toISOString();
  const rows = [
    {
      requestDate: "2026-05-10T09:00:00.000Z",
      testRequestId: 101,
      patientName: "أحمد حسن",
      testNameAr: "تعداد دم كامل",
      testNameEn: "CBC",
      testPrice: 85,
      paymentsApplied: 85,
    },
    {
      requestDate: "2026-05-12T11:00:00.000Z",
      testRequestId: 102,
      patientName: "فاطمة علي",
      testNameAr: "سكر صائم",
      testNameEn: "FBS",
      testPrice: 50,
      paymentsApplied: 30,
    },
    {
      requestDate: "2026-05-18T08:30:00.000Z",
      testRequestId: 103,
      patientName: "عمر خالد",
      testNameAr: "هرمون الغدة الدرقية",
      testNameEn: "TSH",
      testPrice: 120,
      paymentsApplied: 0,
    },
  ];

  const totalTestsAmount = rows.reduce((s, r) => s + r.testPrice, 0);
  const totalPayments = rows.reduce((s, r) => s + r.paymentsApplied, 0);

  return {
    settings: mockAccountingGetSettings(),
    labClientId: params.labClientId,
    labName: "مخبر النور",
    periodFrom,
    periodTo,
    labOutstandingBalance: 270,
    rows,
    totals: {
      totalTestsAmount,
      totalPayments,
      remainingAmount: totalTestsAmount - totalPayments,
      previousBalance: 100,
      balanceUntilPeriodEnd: 370,
    },
    chart: [
      { label: "2026-05", testsAmount: totalTestsAmount, paymentsAmount: totalPayments, remainingAmount: totalTestsAmount - totalPayments },
    ],
    analysis: {
      testsCount: rows.length,
      distinctPatientsCount: 3,
      averageTestPrice: totalTestsAmount / rows.length,
      paymentCoveragePercentage: Math.round((totalPayments / totalTestsAmount) * 100),
      highestRevenueTestName: "TSH",
      highestRevenueTestAmount: 120,
    },
    uploadedFiles: [],
  };
}

export function mockAccountingListPayments(params: {
  labClientId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}): PaginatedPayments {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  let filtered = paymentsStore;
  if (params.labClientId) {
    filtered = filtered.filter((p) => p.labClientId === params.labClientId);
  }
  if (params.from || params.to) {
    filtered = filtered.filter((p) =>
      inDateRange(p.paidAt, params.from, params.to),
    );
  }
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function mockAccountingCreatePayment(
  body: Omit<AccountingPayment, "id" | "createdAt" | "labName"> & {
    labName?: string;
  },
): AccountingPayment {
  const created: AccountingPayment = {
    id: nextPaymentId++,
    labClientId: body.labClientId,
    labName: body.labName ?? "مخبر النور",
    amount: body.amount,
    paidAt: body.paidAt,
    paymentMethod: body.paymentMethod,
    referenceNumber: body.referenceNumber ?? "",
    notes: body.notes ?? "",
    createdAt: new Date().toISOString(),
  };
  paymentsStore = [created, ...paymentsStore];
  return created;
}

export function mockAccountingUpdatePayment(
  id: number,
  body: Omit<AccountingPayment, "id" | "createdAt" | "labName"> & {
    labName?: string;
  },
): AccountingPayment | null {
  const idx = paymentsStore.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const updated: AccountingPayment = {
    ...paymentsStore[idx],
    ...body,
    id,
    labName: body.labName ?? paymentsStore[idx].labName,
  };
  paymentsStore = [...paymentsStore.slice(0, idx), updated, ...paymentsStore.slice(idx + 1)];
  return updated;
}

export function mockAccountingDeletePayment(id: number): boolean {
  const before = paymentsStore.length;
  paymentsStore = paymentsStore.filter((p) => p.id !== id);
  return paymentsStore.length < before;
}

/** Minimal PDF bytes for mock download */
export function mockAccountingPdfBytes(): ArrayBuffer {
  const text = "%PDF-1.4 mock accounting statement";
  return new TextEncoder().encode(text).buffer;
}
