const endpoint = {
  findAll: "/admin/pages",
  findOne: (id: number) => `/admin/pages/${encodeURIComponent(String(id))}`,
  create: "/admin/pages",
  update: (id: number) => `/admin/pages/${encodeURIComponent(String(id))}`,
  remove: (id: number) => `/admin/pages/${encodeURIComponent(String(id))}`,
  navigation: "/website/pages/navigation",
  publicPage: (slug: string) => `/website/pages/${encodeURIComponent(slug)}`,
};

export { endpoint };
