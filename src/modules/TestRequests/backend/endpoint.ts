const endpoint = {
  findAll: "/api/test-requests",
  create: "/api/test-requests",
  findOne: (id: string) => `/api/test-requests/${id}`,
  update: (id: string) => `/api/test-requests/${id}`,
  delete: (id: string) => `/api/test-requests/${id}`,
};
export { endpoint };
