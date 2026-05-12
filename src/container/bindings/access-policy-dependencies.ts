import { Container } from "inversify";
import {
  accessPolicyModuleNames,
  AccessPolicyBackendClient,
  AccessPolicyBackendService,
  AccessPolicyFrontendClient,
  AccessPolicyFrontendService,
} from "@/modules/access-policy";

const bindFront = (container: Container) => {
  container.bind(accessPolicyModuleNames.client).to(AccessPolicyFrontendClient);
  container.bind(accessPolicyModuleNames.service).to(AccessPolicyFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(accessPolicyModuleNames.client).to(AccessPolicyBackendClient);
  container.bind(accessPolicyModuleNames.service).to(AccessPolicyBackendService);
  return container;
};

export {
  bindBack as bindBackAccessPolicyDependencies,
  bindFront as bindFrontAccessPolicyDependencies,
};
