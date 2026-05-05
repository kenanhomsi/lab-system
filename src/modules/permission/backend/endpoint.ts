const endpoint = {
  findAll: "/api/permissions",
  create: "/api/permissions",
  findOne: (id: string) => `/api/permissions/${id}`,
  update: (id: string) => `/api/permissions/${id}`,
  remove: (id: string) => `/api/permissions/${id}`,
};

export { endpoint };
