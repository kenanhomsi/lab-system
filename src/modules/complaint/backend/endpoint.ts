const endpoint = {
  findAll: "/api/admin/complaints",
  updateStatus: (id: string) => `/api/admin/complaints/${id}/status`,
  findMine: "/api/users/me/complaints",
  createMine: "/api/users/me/complaints",
};

export { endpoint };
