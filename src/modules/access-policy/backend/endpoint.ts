const endpoint = {
  findAll: "/api/admin/access-policies",
  findAllTables: "/api/admin/access-policies/tables",
  findTableFields: (tableName: string) =>
    `/api/admin/access-policies/tables/${encodeURIComponent(tableName)}/fields`,
  create: "/api/admin/access-policies",
  validate: "/api/admin/access-policies/validate",
  findOne: (id: string) => `/api/admin/access-policies/${id}`,
  update: (id: string) => `/api/admin/access-policies/${id}`,
  remove: (id: string) => `/api/admin/access-policies/${id}`,
  enable: (id: string) => `/api/admin/access-policies/${id}/enable`,
  disable: (id: string) => `/api/admin/access-policies/${id}/disable`,
};

export { endpoint };
