const endpoint = {
  findAll: "/admin/access-policies",
  create: "/admin/access-policies",
  validate: "/admin/access-policies/validate",
  findOne: (id: string) => `/admin/access-policies/${id}`,
  update: (id: string) => `/admin/access-policies/${id}`,
  remove: (id: string) => `/admin/access-policies/${id}`,
  enable: (id: string) => `/admin/access-policies/${id}/enable`,
  disable: (id: string) => `/admin/access-policies/${id}/disable`,
};

export { endpoint };
