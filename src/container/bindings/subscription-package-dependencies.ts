import { Container } from "inversify";
import {
  subscriptionPackageModuleNames,
  SubscriptionPackageBackendClient,
  SubscriptionPackageBackendService,
  SubscriptionPackageFrontendClient,
  SubscriptionPackageFrontendService,
} from "@/modules/subscription-package";

const bindFront = (container: Container) => {
  container
    .bind(subscriptionPackageModuleNames.client)
    .to(SubscriptionPackageFrontendClient);
  container
    .bind(subscriptionPackageModuleNames.service)
    .to(SubscriptionPackageFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container
    .bind(subscriptionPackageModuleNames.client)
    .to(SubscriptionPackageBackendClient);
  container
    .bind(subscriptionPackageModuleNames.service)
    .to(SubscriptionPackageBackendService);
  return container;
};

export {
  bindBack as bindBackSubscriptionPackageDependencies,
  bindFront as bindFrontSubscriptionPackageDependencies,
};
