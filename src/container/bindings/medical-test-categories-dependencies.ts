import { Container } from "inversify";
import {
  MedicalTestCategoryBackendClient,
  MedicalTestCategoryBackendService,
  MedicalTestCategoryFrontendClient,
  MedicalTestCategoryFrontendService,
  medicalTestCategoryModuleNames,
} from "@/modules/medical-test-categories";

const bindFront = (container: Container) => {
  container.bind(medicalTestCategoryModuleNames.client).to(MedicalTestCategoryFrontendClient);
  container.bind(medicalTestCategoryModuleNames.service).to(MedicalTestCategoryFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(medicalTestCategoryModuleNames.client).to(MedicalTestCategoryBackendClient);
  container.bind(medicalTestCategoryModuleNames.service).to(MedicalTestCategoryBackendService);
  return container;
};

export {
  bindBack as bindBackMedicalTestCategoryDependencies,
  bindFront as bindFrontMedicalTestCategoryDependencies,
};
