import { Container } from "inversify";
import {
  ActivateUserCommand,
  ChangePasswordMeCommand,
  CreateUserCommand,
  DeactivateUserCommand,
  DeleteUserCommand,
  RequestDeletionMeCommand,
  UpdateUserCommand,
  UpdateMeCommand,
  UserBackendClient,
  UserBackendService,
  UserFrontendClient,
  UserFrontendService,
  userModuleNames,
} from "@/modules/user";

const bindFront = (container: Container) => {
  container.bind(userModuleNames.client).to(UserFrontendClient);
  container.bind(userModuleNames.service).to(UserFrontendService);
  container.bind(userModuleNames.createUserCommand).to(CreateUserCommand);
  container.bind(userModuleNames.updateUserCommand).to(UpdateUserCommand);
  container.bind(userModuleNames.deleteUserCommand).to(DeleteUserCommand);
  container.bind(userModuleNames.activateUserCommand).to(ActivateUserCommand);
  container.bind(userModuleNames.deactivateUserCommand).to(DeactivateUserCommand);
  container.bind(userModuleNames.updateMeCommand).to(UpdateMeCommand);
  container.bind(userModuleNames.changePasswordMeCommand).to(ChangePasswordMeCommand);
  container.bind(userModuleNames.requestDeletionMeCommand).to(RequestDeletionMeCommand);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(userModuleNames.client).to(UserBackendClient);
  container.bind(userModuleNames.service).to(UserBackendService);
  return container;
};

export {
  bindBack as bindBackUserDependencies,
  bindFront as bindFrontUserDependencies,
};
