const names = {
  client: Symbol.for("MedicalTestClient"),
  service: Symbol.for("MedicalTestService"),
  createMedicalTestCommand: Symbol.for("CreateMedicalTestCommand"),
  deleteMedicalTestCommand: Symbol.for("deleteMedicalTestCommand"),
  updateMedicalTestCommand: Symbol.for("updateMedicalTestCommand"),
};
export { names as medicalTestModuleNames };
