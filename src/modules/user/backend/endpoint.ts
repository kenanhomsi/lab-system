const endpoint = {
  findAll: "/api/admin/users",
  create: "/api/admin/users",
  findOne: (id: string) => `/api/admin/users/${id}`,
  update: (id: string) => `/api/admin/users/${id}`,
  delete: (id: string) => `/api/admin/users/${id}`,
  activate: (id: string) => `/api/admin/users/${id}/activate`,
  deactivate: (id: string) => `/api/admin/users/${id}/deactivate`,
  roles: (id: string) => `/api/admin/users/${id}/roles`,
  permissions: (id: string) => `/api/admin/users/${id}/permissions`,
  removePermission: (id: string, permission: string) =>
    `/api/admin/users/${id}/permissions/${permission}`,
  me: "/api/users/me",
  updateMe: "/api/users/me",
  changePasswordMe: "/api/users/me/change-password",
  requestDeletionMe: "/api/users/me/request-deletion",
};
export { endpoint };
