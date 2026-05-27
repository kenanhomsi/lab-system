import { Container } from "inversify";
import {
  dashboardModuleNames,
  DashboardBackendClient,
  DashboardBackendService,
  DashboardFrontendClient,
  DashboardFrontendService,
} from "@/modules/dashboard";

const bindFront = (container: Container) => {
  container.bind(dashboardModuleNames.client).to(DashboardFrontendClient);
  container.bind(dashboardModuleNames.service).to(DashboardFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(dashboardModuleNames.client).to(DashboardBackendClient);
  container.bind(dashboardModuleNames.service).to(DashboardBackendService);
  return container;
};

export {
  bindBack as bindBackDashboardDependencies,
  bindFront as bindFrontDashboardDependencies,
};
