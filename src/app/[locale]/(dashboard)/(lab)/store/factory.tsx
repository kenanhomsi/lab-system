"use client";

import { StorefrontApiProvider } from "./api";
import { StorefrontObserverProvider } from "./observer";
import { StorefrontStateProvider } from "./state";
import { StorefrontUtilsProvider } from "./utils";
import { StorefrontUIFactory } from "./ui/factory";

export function StorefrontFeatureFactory() {
  return (
    <StorefrontStateProvider>
      <StorefrontApiProvider>
        <StorefrontObserverProvider>
          <StorefrontUtilsProvider>
            <StorefrontUIFactory />
          </StorefrontUtilsProvider>
        </StorefrontObserverProvider>
      </StorefrontApiProvider>
    </StorefrontStateProvider>
  );
}
