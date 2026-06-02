import { Container } from "inversify";
import {
  accountingModuleNames,
  AccountingBackendClient,
  AccountingBackendService,
  AccountingFrontendClient,
  AccountingFrontendService,
} from "@/modules/accounting";

const bindFront = (container: Container) => {
  container.bind(accountingModuleNames.client).to(AccountingFrontendClient);
  container.bind(accountingModuleNames.service).to(AccountingFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(accountingModuleNames.client).to(AccountingBackendClient);
  container.bind(accountingModuleNames.service).to(AccountingBackendService);
  return container;
};

export {
  bindBack as bindBackAccountingDependencies,
  bindFront as bindFrontAccountingDependencies,
};
