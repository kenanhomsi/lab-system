const endpoint = {
  findAll: "/api/admin/subscription-packages",
  create: "/api/admin/subscription-packages",
  findOne: (id: string) => `/api/admin/subscription-packages/${id}`,
  update: (id: string) => `/api/admin/subscription-packages/${id}`,
  activate: (id: string) => `/api/admin/subscription-packages/${id}/activate`,
  deactivate: (id: string) => `/api/admin/subscription-packages/${id}/deactivate`,
};

export { endpoint };
