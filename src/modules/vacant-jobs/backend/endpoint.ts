const endpoint = {
  findAll: "/api/vacant-jobs",
  create: "/api/vacant-jobs",
  findOne: (id: string) => `/api/vacant-jobs/${id}`,
  update: (id: string) => `/api/vacant-jobs/${id}`,
  delete: (id: string) => `/api/vacant-jobs/${id}`,
};
export { endpoint };
