"use client";

import { ComplaintApiProvider } from "./api";
import { ComplaintObserverProvider } from "./observer";
import { ComplaintStateProvider } from "./state";
import { ComplaintUtilsProvider } from "./utils";
import { ComplaintUIFactory } from "./ui/factory";

export function ComplaintFeatureFactory() {
  return (
    <ComplaintStateProvider>
      <ComplaintApiProvider>
        <ComplaintObserverProvider>
          <ComplaintUtilsProvider>
            <ComplaintUIFactory />
          </ComplaintUtilsProvider>
        </ComplaintObserverProvider>
      </ComplaintApiProvider>
    </ComplaintStateProvider>
  );
}
