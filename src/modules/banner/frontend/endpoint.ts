const endpoint = {
  findAll: "/admin/banners",
  create: "/admin/banners",
  findOne: (id: string) => `/admin/banners/${id}`,
  update: (id: string) => `/admin/banners/${id}`,
  remove: (id: string) => `/admin/banners/${id}`,
};

export { endpoint };
