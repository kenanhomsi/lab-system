import { Container } from "inversify";
import {
  permissionModuleNames,
  PermissionBackendClient,
  PermissionBackendService,
  PermissionFrontendClient,
  PermissionFrontendService,
} from "@/modules/permission";

const bindFront = (container: Container) => {
  container.bind(permissionModuleNames.client).to(PermissionFrontendClient);
  container.bind(permissionModuleNames.service).to(PermissionFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(permissionModuleNames.client).to(PermissionBackendClient);
  container.bind(permissionModuleNames.service).to(PermissionBackendService);
  return container;
};

export {
  bindBack as bindBackPermissionDependencies,
  bindFront as bindFrontPermissionDependencies,
};
