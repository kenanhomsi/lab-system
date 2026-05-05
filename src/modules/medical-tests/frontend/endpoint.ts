const endpoint = {
  findAll: "/medical-tests",
  create: "/medical-tests",
  findOne: (id: string) => `/medical-tests/${id}`,
  update: (id: string) => `/medical-tests/${id}`,
  delete: (id: string) => `/medical-tests/${id}`,
};
export { endpoint };
