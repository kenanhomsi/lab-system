"use client";

import { JoinAsClientApiProvider } from "./api";
import { JoinAsClientObserverProvider } from "./observer";
import { JoinAsClientStateProvider } from "./state";
import { JoinAsClientUtilsProvider } from "./utils";
import { JoinAsClientUIFactory } from "./ui/factory";

export function JoinAsClientFeatureFactory() {
  return (
    <JoinAsClientStateProvider>
      <JoinAsClientApiProvider>
        <JoinAsClientObserverProvider>
          <JoinAsClientUtilsProvider>
            <JoinAsClientUIFactory />
          </JoinAsClientUtilsProvider>
        </JoinAsClientObserverProvider>
      </JoinAsClientApiProvider>
    </JoinAsClientStateProvider>
  );
}
