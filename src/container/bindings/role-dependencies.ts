import { Container } from "inversify";
import {
  roleModuleNames,
  RoleBackendClient,
  RoleBackendService,
  RoleFrontendClient,
  RoleFrontendService,
} from "@/modules/role";

const bindFront = (container: Container) => {
  container.bind(roleModuleNames.client).to(RoleFrontendClient);
  container.bind(roleModuleNames.service).to(RoleFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(roleModuleNames.client).to(RoleBackendClient);
  container.bind(roleModuleNames.service).to(RoleBackendService);
  return container;
};

export {
  bindBack as bindBackRoleDependencies,
  bindFront as bindFrontRoleDependencies,
};
