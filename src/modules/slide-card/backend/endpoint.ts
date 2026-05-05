const endpoint = {
  findAll: "/api/admin/slide-cards",
  findAllPublic: "/api/website/slide-cards",
  create: "/api/admin/slide-cards",
  findOne: (id: string) => `/api/admin/slide-cards/${id}`,
};

export { endpoint };
