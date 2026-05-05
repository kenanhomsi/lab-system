const endpoint = {
  findAll: "/external-patients",
  create: "/external-patients",
  findOne: (id: string) => `/external-patients/${id}`,
  linkDirectPatient: (id: string) =>
    `/external-patients/${id}/link-direct-patient`,
};
export { endpoint };
