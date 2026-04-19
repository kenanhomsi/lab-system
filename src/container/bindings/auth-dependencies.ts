import {
  AuthBackendClient,
  AuthBackendService,
  AuthFrontClient,
  authModuleNames,
  AuthService,
  CheckEmailCommand,
  LoginCommand,
  RegisterCommand,
  ResetPasswordCommand,
} from "@/modules/auth";
import { AuthBackendUtils } from "@/modules/auth/backend/utils";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(authModuleNames.client).to(AuthFrontClient);
  container.bind(authModuleNames.service).to(AuthService);
  container.bind(authModuleNames.loginCommand).to(LoginCommand);
  container.bind(authModuleNames.registerCommand).to(RegisterCommand);
  container.bind(authModuleNames.resetPasswordCommand).to(ResetPasswordCommand);
  container.bind(authModuleNames.checkEmailCommand).to(CheckEmailCommand);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(authModuleNames.client).to(AuthBackendClient);
  container.bind(authModuleNames.service).to(AuthBackendService);
  container.bind(authModuleNames.utils).to(AuthBackendUtils);
  return container;
};

export {
  bindBack as bindBackAuthDependencies,
  bindFront as bindFrontAuthDependencies,
};
