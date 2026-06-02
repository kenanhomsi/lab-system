const names = {
  client: Symbol.for("VacantJobClient"),
  service: Symbol.for("VacantJobService"),
  createVacantJobCommand: Symbol.for("CreateVacantJobCommand"),
  deleteVacantJobCommand: Symbol.for("DeleteVacantJobCommand"),
  updateVacantJobCommand: Symbol.for("UpdateVacantJobCommand"),
};
export { names as vacantJobModuleNames };
