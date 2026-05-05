const endpoint = {
  findAll: "/test-results",
  /** BFF forwards `testRequestId` from body to upstream `for-test-request`. */
  create: "/test-results",
  findOne: (id: string) => `/test-results/${id}`,
  update: (id: string) => `/test-results/${id}`,
  delete: (id: string) => `/test-results/${id}`,
};
export { endpoint };
