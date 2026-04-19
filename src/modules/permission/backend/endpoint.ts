const endpoint = {
  findAll: "/api/admin/permissions",
  create: "/api/admin/permissions",
  findOne: (id: string) => `/api/admin/permissions/${id}`,
  update: (id: string) => `/api/admin/permissions/${id}`,
  remove: (id: string) => `/api/admin/permissions/${id}`,
};

export { endpoint };
