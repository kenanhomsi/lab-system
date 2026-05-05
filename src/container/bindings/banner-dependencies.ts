import {
  BannerFrontendClient,
  BannerFrontendService,
  bannerModuleNames,
} from "@/modules/banner";
import {
  BannerBackendClient,
  BannerBackendService,
} from "@/modules/banner/backend";
import { Container } from "inversify";

const bindFront = (container: Container) => {
  container.bind(bannerModuleNames.client).to(BannerFrontendClient);
  container.bind(bannerModuleNames.service).to(BannerFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(bannerModuleNames.client).to(BannerBackendClient);
  container.bind(bannerModuleNames.service).to(BannerBackendService);
  return container;
};

export {
  bindBack as bindBackBannerDependencies,
  bindFront as bindFrontBannerDependencies,
};
