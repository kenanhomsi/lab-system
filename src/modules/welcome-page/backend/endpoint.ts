const endpoint = {
  findAll: "/api/admin/welcome-pages",
  findAllPublic: "/api/website/welcome-pages",
  findOne: (id: number) => `/api/admin/welcome-pages/${encodeURIComponent(String(id))}`,
  create: "/api/admin/welcome-pages",
  update: (id: number) => `/api/admin/welcome-pages/${encodeURIComponent(String(id))}`,
  remove: (id: number) => `/api/admin/welcome-pages/${encodeURIComponent(String(id))}`,
};

export { endpoint };
