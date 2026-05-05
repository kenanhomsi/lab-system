const endpoint = {
  findAll: "/test-requests",
  create: "/test-requests",
  findOne: (id: string) => `/test-requests/${id}`,
  update: (id: string) => `/test-requests/${id}`,
  delete: (id: string) => `/test-requests/${id}`,
};
export { endpoint };
