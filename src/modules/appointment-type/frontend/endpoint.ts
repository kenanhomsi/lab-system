const endpoint = {
  findAll: "/admin/appointment-types",
  create: "/admin/appointment-types",
  findOne: (id: string) => `/admin/appointment-types/${id}`,
  update: (id: string) => `/admin/appointment-types/${id}`,
};

export { endpoint };
