const names = {
  client: Symbol.for("TestResultClient"),
  service: Symbol.for("TestResultService"),
  createTestResultCommand: Symbol.for("createTestResultCommand"),
  deleteTestResultCommand: Symbol.for("deleteTestResultCommand"),
  updateTestResultCommand: Symbol.for("updateTestResultCommand"),
};
export { names as testResultModuleNames };
