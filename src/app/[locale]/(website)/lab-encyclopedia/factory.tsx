"use client";

import { LabEncyclopediaApiProvider } from "./api";
import { LabEncyclopediaObserverProvider } from "./observer";
import { LabEncyclopediaStateProvider } from "./state";
import { LabEncyclopediaUtilsProvider } from "./utils";
import { LabEncyclopediaUIFactory } from "./ui/factory";

export function LabEncyclopediaFeatureFactory() {
  return (
    <LabEncyclopediaStateProvider>
      <LabEncyclopediaApiProvider>
        <LabEncyclopediaObserverProvider>
          <LabEncyclopediaUtilsProvider>
            <LabEncyclopediaUIFactory />
          </LabEncyclopediaUtilsProvider>
        </LabEncyclopediaObserverProvider>
      </LabEncyclopediaApiProvider>
    </LabEncyclopediaStateProvider>
  );
}
