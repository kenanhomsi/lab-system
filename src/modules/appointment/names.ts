const names = {
  client: Symbol.for("appointmentClient"),
  service: Symbol.for("appointmentService"),
  createAppointmentCommand: Symbol.for("createAppointmentCommand"),
};

export { names as appointmentModuleNames };
