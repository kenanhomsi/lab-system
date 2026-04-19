const endpoint = {
  findAll: "/admin/users",
  create: "/admin/users",
  findOne: (id: string) => `/admin/users/${id}`,
  update: (id: string) => `/admin/users/${id}`,
  delete: (id: string) => `/admin/users/${id}`,
  activate: (id: string) => `/admin/users/${id}/activate`,
  deactivate: (id: string) => `/admin/users/${id}/deactivate`,
  roles: (id: string) => `/admin/users/${id}/roles`,
  permissions: (id: string) => `/admin/users/${id}/permissions`,
  removePermission: (id: string, permission: string) =>
    `/admin/users/${id}/permissions/${permission}`,
  me: "/users/me",
  updateMe: "/users/me",
  changePasswordMe: "/users/me/change-password",
  requestDeletionMe: "/users/me/request-deletion",
};
export { endpoint };
