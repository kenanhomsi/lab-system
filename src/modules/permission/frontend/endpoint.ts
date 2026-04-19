const endpoint = {
  findAll: "/admin/permissions",
  create: "/admin/permissions",
  findOne: (id: string) => `/admin/permissions/${id}`,
  update: (id: string) => `/admin/permissions/${id}`,
  remove: (id: string) => `/admin/permissions/${id}`,
};

export { endpoint };
