const endpoint = {
  findAll: "/admin/appointments",
  create: "/admin/appointments",
  findOne: (id: string) => `/admin/appointments/${id}`,
  confirm: (id: string) => `/admin/appointments/${id}/confirm`,
  cancel: (id: string) => `/admin/appointments/${id}/cancel`,
};

export { endpoint };
