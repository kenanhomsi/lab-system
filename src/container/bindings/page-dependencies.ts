import { Container } from "inversify";
import {
  PageBackendClient,
  PageBackendService,
  PageFrontendClient,
  PageFrontendService,
  pageModuleNames,
} from "@/modules/pages";

const bindFront = (container: Container) => {
  container.bind(pageModuleNames.client).to(PageFrontendClient);
  container.bind(pageModuleNames.service).to(PageFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(pageModuleNames.client).to(PageBackendClient);
  container.bind(pageModuleNames.service).to(PageBackendService);
  return container;
};

export {
  bindBack as bindBackPageDependencies,
  bindFront as bindFrontPageDependencies,
};
