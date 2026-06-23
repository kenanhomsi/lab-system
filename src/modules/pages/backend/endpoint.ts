const endpoint = {
  findAll: "/api/admin/pages",
  findOne: (id: number) => `/api/admin/pages/${encodeURIComponent(String(id))}`,
  create: "/api/admin/pages",
  update: (id: number) => `/api/admin/pages/${encodeURIComponent(String(id))}`,
  remove: (id: number) => `/api/admin/pages/${encodeURIComponent(String(id))}`,
  navigation: "/api/website/pages/navigation",
  publicPage: (slug: string) => `/api/website/pages/${encodeURIComponent(slug)}`,
};

export { endpoint };
