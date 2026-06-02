const endpoint = {
  findAll: "/vacant-jobs",
  create: "/vacant-jobs",
  findOne: (id: string) => `/vacant-jobs/${id}`,
  update: (id: string) => `/vacant-jobs/${id}`,
  delete: (id: string) => `/vacant-jobs/${id}`,
};
export { endpoint };
