const endpoint = {
  findAll: "/api/medical-tests",
  create: "/api/medical-tests",
  findOne: (id: string) => `/api/medical-tests/${id}`,
  update: (id: string) => `/api/medical-tests/${id}`,
  delete: (id: string) => `/api/medical-tests/${id}`,
};
export { endpoint };
