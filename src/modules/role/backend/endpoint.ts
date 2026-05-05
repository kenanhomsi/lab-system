const endpoint = {
  findAll: "/api/admin/roles",
  create: "/api/admin/roles",
  findOne: (id: string) => `/api/admin/roles/${id}`,
  update: (id: string) => `/api/admin/roles/${id}`,
  remove: (id: string) => `/api/admin/roles/${id}`,
  permissions: (id: string) => `/api/admin/roles/${id}/permissions`,
  removePermission: (id: string, permissionId: string) =>
    `/api/admin/roles/${id}/permissions/${permissionId}`,
};

export { endpoint };
