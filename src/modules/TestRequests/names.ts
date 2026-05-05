const names = {
  client: Symbol.for("TestRequestClient"),
  service: Symbol.for("TestRequestService"),
  createTestRequestCommand: Symbol.for("createTestRequestCommand"),
  deleteTestRequestCommand: Symbol.for("deleteTestRequestCommand"),
  updateTestRequestCommand: Symbol.for("updateTestRequestCommand"),
};
export { names as testRequestModuleNames };
