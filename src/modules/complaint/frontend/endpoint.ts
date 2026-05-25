const endpoint = {
  findAll: "/admin/complaints",
  updateStatus: (id: string) => `/admin/complaints/${id}/status`,
  createMine: "/me/complaints",
};

export { endpoint };
