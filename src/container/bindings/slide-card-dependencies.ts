import { Container } from "inversify";
import {
  slideCardModuleNames,
  SlideCardBackendClient,
  SlideCardBackendService,
  SlideCardFrontendClient,
  SlideCardFrontendService,
} from "@/modules/slide-card";

const bindFront = (container: Container) => {
  container.bind(slideCardModuleNames.client).to(SlideCardFrontendClient);
  container.bind(slideCardModuleNames.service).to(SlideCardFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(slideCardModuleNames.client).to(SlideCardBackendClient);
  container.bind(slideCardModuleNames.service).to(SlideCardBackendService);
  return container;
};

export {
  bindBack as bindBackSlideCardDependencies,
  bindFront as bindFrontSlideCardDependencies,
};
