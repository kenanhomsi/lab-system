const endpoint = {
  findAll: "/api/external-patients",
  create: "/api/external-patients",
  findOne: (id: string) => `/api/external-patients/${id}`,
  linkDirectPatient: (id: string) =>
    `/api/external-patients/${id}/link-direct-patient`,
};
export { endpoint };
