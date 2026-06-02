const base = "/special";
const endpoint = {
  payments: `${base}/payments`,
  expenses: `${base}/expenses`,
  statement: `${base}/statement`,
  tasks: `${base}/tasks`,
  taskById: (id: string) => `${base}/tasks/${id}`,
  lookupDescriptions: `${base}/lookup/descriptions`,
  lookupExpenseTypes: `${base}/lookup/expense-types`,
};
export { endpoint };
