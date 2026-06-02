const endpoint = {
  findAll: "/insurance-approval-requests",
  findMine: "/insurance-approval-requests/my",
  findMineOne: (id: string) => `/insurance-approval-requests/my/${id}`,
  findOne: (id: string) => `/insurance-approval-requests/${id}`,
  create: "/insurance-approval-requests",
  updateStatus: (id: string) => `/insurance-approval-requests/${id}/status`,
  remove: (id: string) => `/insurance-approval-requests/${id}`,
};

export { endpoint };
