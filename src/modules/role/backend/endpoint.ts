const endpoint = {
  findAll: "/api/admin/roles",
  create: "/api/admin/roles",
  findOne: (id: string) => `/api/admin/roles/${id}`,
  update: (id: string) => `/api/admin/roles/${id}`,
  remove: (id: string) => `/api/admin/roles/${id}`,
};

export { endpoint };
