const endpoint = {
  findAll: "/api/admin/complaints",
  updateStatus: (id: string) => `/api/admin/complaints/${id}/status`,
};

export { endpoint };
