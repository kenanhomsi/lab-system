const endpoint = {
  findAll: "/api/admin/ads",
  findAllPublic: "/api/website/ads",
  findOne: (id: number) => `/api/admin/ads/${encodeURIComponent(String(id))}`,
  create: "/api/admin/ads",
  update: (id: number) => `/api/admin/ads/${encodeURIComponent(String(id))}`,
  remove: (id: number) => `/api/admin/ads/${encodeURIComponent(String(id))}`,
};

export { endpoint };
