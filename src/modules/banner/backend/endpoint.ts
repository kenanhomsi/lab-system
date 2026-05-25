const endpoint = {
  findAll: "/api/admin/banners",
  findAllPublic: "/api/website/banners",
  create: "/api/admin/banners",
  update: (id: string) =>
    `/api/admin/banners/${encodeURIComponent(id)}`,
  remove: (id: string) =>
    `/api/admin/banners/${encodeURIComponent(id)}`,
};

export { endpoint };
