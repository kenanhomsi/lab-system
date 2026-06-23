import { AdFrontendClient, AdFrontendService, adModuleNames } from "@/modules/ad";
import { AdBackendClient, AdBackendService } from "@/modules/ad/backend";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(adModuleNames.client).to(AdFrontendClient);
  container.bind(adModuleNames.service).to(AdFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(adModuleNames.client).to(AdBackendClient);
  container.bind(adModuleNames.service).to(AdBackendService);
  return container;
};

export {
  bindBack as bindBackAdDependencies,
  bindFront as bindFrontAdDependencies,
};
