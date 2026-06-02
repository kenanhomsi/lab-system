import { Container } from "inversify";
import {
  specialAccountModuleNames,
  SpecialAccountBackendClient,
  SpecialAccountBackendService,
  SpecialAccountFrontendClient,
  SpecialAccountFrontendService,
} from "@/modules/special-account";

const bindFront = (container: Container) => {
  container.bind(specialAccountModuleNames.client).to(SpecialAccountFrontendClient);
  container.bind(specialAccountModuleNames.service).to(SpecialAccountFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(specialAccountModuleNames.client).to(SpecialAccountBackendClient);
  container.bind(specialAccountModuleNames.service).to(SpecialAccountBackendService);
  return container;
};

export {
  bindBack as bindBackSpecialAccountDependencies,
  bindFront as bindFrontSpecialAccountDependencies,
};
