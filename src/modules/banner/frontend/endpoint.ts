const endpoint = {
  findAll: "/admin/banners",
  findAllPublic: "/website/banners",
  create: "/admin/banners",
  remove: (id: string) => `/admin/banners/${encodeURIComponent(id)}`,
};

export { endpoint };
