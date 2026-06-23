const endpoint = {
  findAll: "/admin/welcome-pages",
  findAllPublic: "/website/welcome-pages",
  findOne: (id: number) => `/admin/welcome-pages/${encodeURIComponent(String(id))}`,
  create: "/admin/welcome-pages",
  update: (id: number) => `/admin/welcome-pages/${encodeURIComponent(String(id))}`,
  remove: (id: number) => `/admin/welcome-pages/${encodeURIComponent(String(id))}`,
};

export { endpoint };
