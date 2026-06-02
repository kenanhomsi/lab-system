"use client";

import { frontendContainer } from "@/container/frontend";
import {
  AccountingFrontendService,
  accountingModuleNames,
} from "@/modules/accounting";

const accountingService = frontendContainer.get<AccountingFrontendService>(
  accountingModuleNames.service,
);

export { accountingService };
