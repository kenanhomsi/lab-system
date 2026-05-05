import { Container } from "inversify";
import {
  testRequestModuleNames,
  TestRequestBackendService,
  TestRequestFrontendClient,
  TestRequestFrontendService,
  TestRequestBackendClient,
  CreateTestRequestCommand,
  UpdateTestRequestCommand,
  DeleteTestRequestCommand,
} from "@/modules/TestRequests";

const bindFront = (container: Container) => {
  container
    .bind(testRequestModuleNames.client)
        .to(TestRequestFrontendClient);
  container
    .bind(testRequestModuleNames.service)
    .to(TestRequestFrontendService);
  container
    .bind(testRequestModuleNames.createTestRequestCommand)
    .to(CreateTestRequestCommand);
  container
    .bind(testRequestModuleNames.updateTestRequestCommand)
    .to(UpdateTestRequestCommand);
  container
    .bind(testRequestModuleNames.deleteTestRequestCommand)
    .to(DeleteTestRequestCommand);
  return container;
};

const bindBack = (container: Container) => {
  container
    .bind(testRequestModuleNames.client)
    .to(TestRequestBackendClient);
  container
    .bind(testRequestModuleNames.service)
    .to(TestRequestBackendService);
  return container;
};

export {
  bindBack as bindBackTestRequestsDependencies,
  bindFront as bindFrontTestRequestsDependencies,
};
