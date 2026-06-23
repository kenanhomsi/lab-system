const endpoint = {
  findAll: "/admin/banners",
  findAllPublic: "/website/banners",
  create: "/admin/banners",
  update: (id: string) => `/admin/banners/${encodeURIComponent(id)}`,
  remove: (id: string) => `/admin/banners/${encodeURIComponent(id)}`,
};

export { endpoint };
