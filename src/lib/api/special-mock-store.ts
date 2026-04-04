export type LookupItem = {
  id: string;
  labelEn: string;
  labelAr: string;
};

export type SpecialPayment = {
  id: string;
  date: string;
  amount: number;
  description: string;
  note: string;
  createdAt: string;
};

export type SpecialExpense = {
  id: string;
  date: string;
  amount: number;
  expenseType: string;
  note: string;
  createdAt: string;
};

export type SpecialTask = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  reminderEnabled: boolean;
  completed: boolean;
  createdAt: string;
};

export const MOCK_DESCRIPTION_LOOKUP: LookupItem[] = [
  { id: "consultation", labelEn: "Consultation fees", labelAr: "أتعاب استشارة" },
  { id: "lab_share", labelEn: "Laboratory share", labelAr: "حصة مختبر" },
  { id: "equipment", labelEn: "Equipment rental", labelAr: "إيجار معدات" },
  { id: "other_income", labelEn: "Other income", labelAr: "دخل آخر" },
];

export const MOCK_EXPENSE_TYPE_LOOKUP: LookupItem[] = [
  { id: "rent", labelEn: "Rent", labelAr: "إيجار" },
  { id: "utilities", labelEn: "Utilities", labelAr: "مرافق" },
  { id: "supplies", labelEn: "Supplies", labelAr: "مستلزمات" },
  { id: "salary", labelEn: "Salaries", labelAr: "رواتب" },
  { id: "other_exp", labelEn: "Other expense", labelAr: "مصروف آخر" },
];

function inDateRange(
  dateStr: string,
  from: string | null | undefined,
  to: string | null | undefined,
): boolean {
  if (from && dateStr < from) return false;
  if (to && dateStr > to) return false;
  return true;
}

const seedPayments: SpecialPayment[] = [
  {
    id: "pay-1",
    date: "2026-04-01",
    amount: 1200,
    description: "consultation",
    note: "",
    createdAt: new Date("2026-04-01T10:00:00Z").toISOString(),
  },
  {
    id: "pay-2",
    date: "2026-04-02",
    amount: 450.5,
    description: "lab_share",
    note: "Q1 share",
    createdAt: new Date("2026-04-02T14:30:00Z").toISOString(),
  },
];

const seedExpenses: SpecialExpense[] = [
  {
    id: "exp-1",
    date: "2026-04-01",
    amount: 800,
    expenseType: "rent",
    note: "",
    createdAt: new Date("2026-04-01T09:00:00Z").toISOString(),
  },
  {
    id: "exp-2",
    date: "2026-04-03",
    amount: 120,
    expenseType: "utilities",
    note: "Electricity",
    createdAt: new Date("2026-04-03T11:00:00Z").toISOString(),
  },
];

const seedTasks: SpecialTask[] = [
  {
    id: "task-1",
    title: "Review lab reports",
    description: "Check pending CBC panels",
    dueDate: "2026-04-05",
    dueTime: "10:00",
    reminderEnabled: true,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Monthly reconciliation",
    description: "",
    dueDate: "2026-04-04",
    dueTime: "16:00",
    reminderEnabled: false,
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

let paymentsStore: SpecialPayment[] = seedPayments.map((p) => ({ ...p }));
let expensesStore: SpecialExpense[] = seedExpenses.map((e) => ({ ...e }));
let tasksStore: SpecialTask[] = seedTasks.map((t) => ({ ...t }));

export function mockSpecialPaymentsList(
  from?: string | null,
  to?: string | null,
): SpecialPayment[] {
  return paymentsStore.filter((p) => inDateRange(p.date, from, to));
}

export function mockSpecialPaymentsCreate(
  body: Pick<SpecialPayment, "date" | "amount" | "description" | "note">,
): SpecialPayment {
  const row: SpecialPayment = {
    id: `pay-${Date.now()}`,
    date: body.date,
    amount: Number(body.amount),
    description: body.description,
    note: body.note ?? "",
    createdAt: new Date().toISOString(),
  };
  paymentsStore = [...paymentsStore, row];
  return row;
}

export function mockSpecialExpensesList(
  from?: string | null,
  to?: string | null,
): SpecialExpense[] {
  return expensesStore.filter((e) => inDateRange(e.date, from, to));
}

export function mockSpecialExpensesCreate(
  body: Pick<SpecialExpense, "date" | "amount" | "expenseType" | "note">,
): SpecialExpense {
  const row: SpecialExpense = {
    id: `exp-${Date.now()}`,
    date: body.date,
    amount: Number(body.amount),
    expenseType: body.expenseType,
    note: body.note ?? "",
    createdAt: new Date().toISOString(),
  };
  expensesStore = [...expensesStore, row];
  return row;
}

export function mockSpecialStatement(from?: string | null, to?: string | null) {
  const paymentRows = mockSpecialPaymentsList(from, to);
  const expenseRows = mockSpecialExpensesList(from, to);
  const totalPayments = paymentRows.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenseRows.reduce((s, e) => s + e.amount, 0);
  return {
    payments: paymentRows,
    expenses: expenseRows,
    totalPayments,
    totalExpenses,
    balance: totalPayments - totalExpenses,
  };
}

export function mockSpecialTasksList(): SpecialTask[] {
  return [...tasksStore].sort((a, b) => {
    if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return a.dueTime.localeCompare(b.dueTime);
  });
}

export function mockSpecialTasksCreate(
  body: Pick<
    SpecialTask,
    "title" | "description" | "dueDate" | "dueTime" | "reminderEnabled"
  >,
): SpecialTask {
  const row: SpecialTask = {
    id: `task-${Date.now()}`,
    title: body.title,
    description: body.description ?? "",
    dueDate: body.dueDate,
    dueTime: body.dueTime ?? "",
    reminderEnabled: Boolean(body.reminderEnabled),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasksStore = [...tasksStore, row];
  return row;
}

export type SpecialTaskPatch = Partial<
  Pick<
    SpecialTask,
    | "title"
    | "description"
    | "dueDate"
    | "dueTime"
    | "reminderEnabled"
    | "completed"
  >
>;

export function mockSpecialTasksUpdate(
  id: string,
  patch: SpecialTaskPatch,
): SpecialTask | undefined {
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const next = { ...tasksStore[idx], ...patch };
  tasksStore = tasksStore.map((t, i) => (i === idx ? next : t));
  return next;
}

export function mockSpecialTasksDelete(id: string): boolean {
  const before = tasksStore.length;
  tasksStore = tasksStore.filter((t) => t.id !== id);
  return tasksStore.length < before;
}
