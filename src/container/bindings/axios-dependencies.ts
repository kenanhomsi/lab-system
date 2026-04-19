import {
  AxiosModuleNames,
  BackendClient,
  BackendState,
  FrontendClient,
  FrontendState,
} from "@/modules/axios";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(AxiosModuleNames.state).to(FrontendState);
  container.bind(AxiosModuleNames.client).to(FrontendClient);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(AxiosModuleNames.state).to(BackendState);
  container.bind(AxiosModuleNames.client).to(BackendClient);
  return container;
};
export {
  bindBack as bindBackAxiosDependencies,
  bindFront as bindFrontAxiosDependencies,
};
