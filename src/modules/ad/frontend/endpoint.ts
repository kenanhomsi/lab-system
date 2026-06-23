const endpoint = {
  findAll: "/admin/ads",
  findAllPublic: "/website/ads",
  findOne: (id: number) => `/admin/ads/${encodeURIComponent(String(id))}`,
  create: "/admin/ads",
  update: (id: number) => `/admin/ads/${encodeURIComponent(String(id))}`,
  remove: (id: number) => `/admin/ads/${encodeURIComponent(String(id))}`,
};

export { endpoint };
