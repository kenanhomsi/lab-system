import { Container } from "inversify";
import {
  appointmentModuleNames,
  AppointmentBackendClient,
  AppointmentBackendService,
  AppointmentFrontendClient,
  AppointmentFrontendService,
  CreateAppointmentCommand,
} from "@/modules/appointment";

const bindFront = (container: Container) => {
  container.bind(appointmentModuleNames.client).to(AppointmentFrontendClient);
  container.bind(appointmentModuleNames.service).to(AppointmentFrontendService);
  container
    .bind(appointmentModuleNames.createAppointmentCommand)
    .to(CreateAppointmentCommand);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(appointmentModuleNames.client).to(AppointmentBackendClient);
  container.bind(appointmentModuleNames.service).to(AppointmentBackendService);
  return container;
};

export {
  bindBack as bindBackAppointmentDependencies,
  bindFront as bindFrontAppointmentDependencies,
};
