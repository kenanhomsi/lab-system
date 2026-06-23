import { Container } from "inversify";
import {
  WelcomePageBackendClient,
  WelcomePageBackendService,
  WelcomePageFrontendClient,
  WelcomePageFrontendService,
  welcomePageModuleNames,
} from "@/modules/welcome-page";

const bindFront = (container: Container) => {
  container.bind(welcomePageModuleNames.client).to(WelcomePageFrontendClient);
  container.bind(welcomePageModuleNames.service).to(WelcomePageFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(welcomePageModuleNames.client).to(WelcomePageBackendClient);
  container.bind(welcomePageModuleNames.service).to(WelcomePageBackendService);
  return container;
};

export {
  bindBack as bindBackWelcomePageDependencies,
  bindFront as bindFrontWelcomePageDependencies,
};
