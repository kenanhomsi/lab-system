import { Container } from "inversify";
import {
  storeModuleNames,
  StoreBackendClient,
  StoreBackendService,
  StoreFrontendClient,
  StoreFrontendService,
} from "@/modules/store";

const bindFront = (container: Container) => {
  container.bind(storeModuleNames.client).to(StoreFrontendClient);
  container.bind(storeModuleNames.service).to(StoreFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(storeModuleNames.client).to(StoreBackendClient);
  container.bind(storeModuleNames.service).to(StoreBackendService);
  return container;
};

export {
  bindBack as bindBackStoreDependencies,
  bindFront as bindFrontStoreDependencies,
};
