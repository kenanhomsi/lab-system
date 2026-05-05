import {
  CreateMedicalTestCommand,
  DeleteMedicalTestCommand,
  MedicalTestBackendClient,
  MedicalTestBackendService,
  MedicalTestFrontendClient,
  MedicalTestFrontendService,
  UpdateMedicalTestCommand,
  medicalTestModuleNames,
} from "@/modules/medical-tests";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(medicalTestModuleNames.client).to(MedicalTestFrontendClient);
  container.bind(medicalTestModuleNames.service).to(MedicalTestFrontendService);
  container
    .bind(medicalTestModuleNames.createMedicalTestCommand)
    .to(CreateMedicalTestCommand);
  container
    .bind(medicalTestModuleNames.updateMedicalTestCommand)
    .to(UpdateMedicalTestCommand);
  container
    .bind(medicalTestModuleNames.deleteMedicalTestCommand)
    .to(DeleteMedicalTestCommand);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(medicalTestModuleNames.client).to(MedicalTestBackendClient);
  container.bind(medicalTestModuleNames.service).to(MedicalTestBackendService);
  return container;
};

export {
  bindBack as bindBackMedicalTestDependencies,
  bindFront as bindFrontMedicalTestDependencies,
};
