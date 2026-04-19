import { Container } from "inversify";
import {
  appointmentTypeModuleNames,
  AppointmentTypeBackendClient,
  AppointmentTypeBackendService,
  AppointmentTypeFrontendClient,
  AppointmentTypeFrontendService,
} from "@/modules/appointment-type";

const bindFront = (container: Container) => {
  container.bind(appointmentTypeModuleNames.client).to(AppointmentTypeFrontendClient);
  container.bind(appointmentTypeModuleNames.service).to(AppointmentTypeFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(appointmentTypeModuleNames.client).to(AppointmentTypeBackendClient);
  container.bind(appointmentTypeModuleNames.service).to(AppointmentTypeBackendService);
  return container;
};

export {
  bindBack as bindBackAppointmentTypeDependencies,
  bindFront as bindFrontAppointmentTypeDependencies,
};
