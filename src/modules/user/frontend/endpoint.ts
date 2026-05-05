const endpoint = {
  findAll: "/user-managment",
  create: "/user-managment",
  findOne: (id: string) => `/user-managment/${id}`,
  update: (id: string) => `/user-managment/${id}`,
  delete: (id: string) => `/user-managment/${id}`,
  activate: (id: string) => `/user-managment/${id}/activate`,
  deactivate: (id: string) => `/user-managment/${id}/deactivate`,
  roles: (id: string) => `/user-managment/${id}/roles`,
  permissions: (id: string) => `/user-managment/${id}/permissions`,
  removePermission: (id: string, permission: string) =>
    `/user-managment/${id}/permissions/${permission}`,
  me: "/user/me",
  updateMe: "/users/me",
  changePasswordMe: "/users/me/change-password",
  requestDeletionMe: "/users/me/request-deletion",
};
export { endpoint };
