const endpoint = {
  findAll: "/api/insurance-approval-requests",
  findMine: "/api/insurance-approval-requests/my",
  findMineOne: (id: string) => `/api/insurance-approval-requests/my/${id}`,
  findOne: (id: string) => `/api/insurance-approval-requests/${id}`,
  create: "/api/insurance-approval-requests",
  updateStatus: (id: string) => `/api/insurance-approval-requests/${id}/status`,
  remove: (id: string) => `/api/insurance-approval-requests/${id}`,
};

export { endpoint };
