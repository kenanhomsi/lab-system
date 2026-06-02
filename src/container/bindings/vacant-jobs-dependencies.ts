import {
  CreateVacantJobCommand,
  DeleteVacantJobCommand,
  UpdateVacantJobCommand,
  VacantJobBackendClient,
  VacantJobBackendService,
  VacantJobFrontendClient,
  VacantJobFrontendService,
  vacantJobModuleNames,
} from "@/modules/vacant-jobs";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(vacantJobModuleNames.client).to(VacantJobFrontendClient);
  container.bind(vacantJobModuleNames.service).to(VacantJobFrontendService);
  container.bind(vacantJobModuleNames.createVacantJobCommand).to(CreateVacantJobCommand);
  container.bind(vacantJobModuleNames.updateVacantJobCommand).to(UpdateVacantJobCommand);
  container.bind(vacantJobModuleNames.deleteVacantJobCommand).to(DeleteVacantJobCommand);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(vacantJobModuleNames.client).to(VacantJobBackendClient);
  container.bind(vacantJobModuleNames.service).to(VacantJobBackendService);
  return container;
};

export {
  bindBack as bindBackVacantJobDependencies,
  bindFront as bindFrontVacantJobDependencies,
};
