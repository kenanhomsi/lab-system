const base = "/accounting";
const endpoint = {
  settings: `${base}/settings`,
  statements: `${base}/statements`,
  statementsPdf: `${base}/statements/pdf`,
  payments: `${base}/payments`,
  paymentById: (id: number) => `${base}/payments/${id}`,
};
export { endpoint };
