const endpoint = {
  findAll: "/admin/subscription-packages",
  create: "/admin/subscription-packages",
  findOne: (id: string) => `/admin/subscription-packages/${id}`,
  update: (id: string) => `/admin/subscription-packages/${id}`,
  activate: (id: string) => `/admin/subscription-packages/${id}/activate`,
  deactivate: (id: string) => `/admin/subscription-packages/${id}/deactivate`,
};

export { endpoint };
