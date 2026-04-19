const endpoint = {
  findAll: "/api/admin/appointments",
  create: "/api/admin/appointments",
  findOne: (id: string) => `/api/admin/appointments/${id}`,
  confirm: (id: string) => `/api/admin/appointments/${id}/confirm`,
  cancel: (id: string) => `/api/admin/appointments/${id}/cancel`,
};

export { endpoint };
