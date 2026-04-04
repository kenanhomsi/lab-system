"use client";

import { CareersApiProvider } from "./api";
import { CareersObserverProvider } from "./observer";
import { CareersStateProvider } from "./state";
import { CareersUtilsProvider } from "./utils";
import { CareersUIFactory } from "./ui/factory";

export function CareersFeatureFactory() {
  return (
    <CareersStateProvider>
      <CareersApiProvider>
        <CareersObserverProvider>
          <CareersUtilsProvider>
            <CareersUIFactory />
          </CareersUtilsProvider>
        </CareersObserverProvider>
      </CareersApiProvider>
    </CareersStateProvider>
  );
}
