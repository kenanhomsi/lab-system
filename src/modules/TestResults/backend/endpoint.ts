const base = "/api/test-results";
const endpoint = {
  findAll: base,
  forTestRequest: (testRequestId: number) =>
    `${base}/for-test-request/${testRequestId}`,
  findOne: (id: string) => `${base}/${id}`,
  update: (id: string) => `${base}/${id}`,
  delete: (id: string) => `${base}/${id}`,
};
export { endpoint };
