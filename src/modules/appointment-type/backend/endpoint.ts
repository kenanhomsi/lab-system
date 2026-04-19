const endpoint = {
  findAll: "/api/admin/appointment-types",
  create: "/api/admin/appointment-types",
  findOne: (id: string) => `/api/admin/appointment-types/${id}`,
  update: (id: string) => `/api/admin/appointment-types/${id}`,
};

export { endpoint };
