"use client";

import { frontendContainer } from "@/container/frontend";
import { storeModuleNames, StoreFrontendService } from "@/modules/store";

const storeService = frontendContainer.get<StoreFrontendService>(storeModuleNames.service);

export { storeService };
