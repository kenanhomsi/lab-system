const endpoint = {
  findAll: "/admin/roles",
  create: "/admin/roles",
  findOne: (id: string) => `/admin/roles/${id}`,
  update: (id: string) => `/admin/roles/${id}`,
  remove: (id: string) => `/admin/roles/${id}`,
};

export { endpoint };
