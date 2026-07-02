const endpoint = {
  findAll: "/admin/slide-cards",
  findAllPublic: "/website/slide-cards",
  create: "/admin/slide-cards",
  findOne: (id: string) => `/admin/slide-cards/${id}`,
  update: (id: string) => `/admin/slide-cards/${id}`,
  remove: (id: string) => `/admin/slide-cards/${id}`,
};

export { endpoint };
