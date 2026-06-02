"use client";

import { frontendContainer } from "@/container/frontend";
import {
  SpecialAccountFrontendService,
  specialAccountModuleNames,
} from "@/modules/special-account";

export const specialAccountService =
  frontendContainer.get<SpecialAccountFrontendService>(
    specialAccountModuleNames.service,
  );
