import { Container } from "inversify";
import {
  externalPatientsModuleNames,
  ExternalPatientsBackendClient,
  ExternalPatientsBackendService,
  ExternalPatientsFrontendClient,
  ExternalPatientsFrontendService,
} from "@/modules/ExternalPatients";

const bindFront = (container: Container) => {
  container
    .bind(externalPatientsModuleNames.client)
    .to(ExternalPatientsFrontendClient);
  container
    .bind(externalPatientsModuleNames.service)
    .to(ExternalPatientsFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container
    .bind(externalPatientsModuleNames.client)
    .to(ExternalPatientsBackendClient);
  container
    .bind(externalPatientsModuleNames.service)
    .to(ExternalPatientsBackendService);
  return container;
};

export {
  bindBack as bindBackExternalPatientsDependencies,
  bindFront as bindFrontExternalPatientsDependencies,
};
