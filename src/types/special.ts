export interface SpecialPayment {
  id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  note?: string;
  createdAt: string;
}

export interface SpecialExpense {
  id: string;
  userId: string;
  date: string;
  amount: number;
  expenseType: string;
  note?: string;
  createdAt: string;
}

export interface AccountStatement {
  payments: SpecialPayment[];
  expenses: SpecialExpense[];
  totalPayments: number;
  totalExpenses: number;
  balance: number;
}

export interface DailyTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  isCompleted: boolean;
  reminderEnabled: boolean;
  createdAt: string;
}

export interface LookupItem {
  id: string;
  label: string;
  labelAr: string;
}
