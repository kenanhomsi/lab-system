import { Container } from "inversify";
import {
  testResultModuleNames,
  TestResultBackendService,
  TestResultFrontendClient,
  TestResultFrontendService,
  TestResultBackendClient,
  CreateTestResultCommand,
  UpdateTestResultCommand,
  DeleteTestResultCommand,
} from "@/modules/TestResults";

const bindFront = (container: Container) => {
  container
    .bind(testResultModuleNames.client)
    .to(TestResultFrontendClient);
  container
    .bind(testResultModuleNames.service)
    .to(TestResultFrontendService);
  container
    .bind(testResultModuleNames.createTestResultCommand)
    .to(CreateTestResultCommand);
  container
    .bind(testResultModuleNames.updateTestResultCommand)
    .to(UpdateTestResultCommand);
  container
    .bind(testResultModuleNames.deleteTestResultCommand)
    .to(DeleteTestResultCommand);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(testResultModuleNames.client).to(TestResultBackendClient);
  container
    .bind(testResultModuleNames.service)
    .to(TestResultBackendService);
  return container;
};

export {
  bindBack as bindBackTestResultsDependencies,
  bindFront as bindFrontTestResultsDependencies,
};
