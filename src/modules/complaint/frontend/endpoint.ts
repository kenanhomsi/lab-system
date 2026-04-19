const endpoint = {
  findAll: "/admin/complaints",
  updateStatus: (id: string) => `/admin/complaints/${id}/status`,
};

export { endpoint };
