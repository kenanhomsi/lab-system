const endpoint = {
  findAll: "/api/users/management",
  create: "/api/users/management",
  findOne: (id: string) => `/api/users/management/${id}`,
  update: (id: string) => `/api/users/management/${id}`,
  delete: (id: string) => `/api/users/management/${id}`,
  activate: (id: string) => `/api/users/management/${id}/activate`,
  deactivate: (id: string) => `/api/users/management/${id}/deactivate`,
  roles: (id: string) => `/api/users/management/${id}/roles`,
  permissions: (id: string) => `/api/users/management/${id}/permissions`,
  removePermission: (id: string, permission: string) =>
    `/api/users/management/${id}/permissions/${permission}`,

  me: "/api/users/me",
  updateMe: "/api/users/me",
  changePasswordMe: "/api/users/me/change-password",
  requestDeletionMe: "/api/users/me/request-deletion",
};
export { endpoint };
