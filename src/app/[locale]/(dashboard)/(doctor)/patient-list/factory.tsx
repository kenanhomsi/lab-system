"use client";

import { PatientListApiProvider } from "./api";
import { PatientListObserverProvider } from "./observer";
import { PatientListStateProvider } from "./state";
import { PatientListUtilsProvider } from "./utils";
import { PatientListUIFactory } from "./ui/factory";

export function PatientListFeatureFactory() {
  return (
    <PatientListStateProvider>
      <PatientListApiProvider>
        <PatientListObserverProvider>
          <PatientListUtilsProvider>
            <PatientListUIFactory />
          </PatientListUtilsProvider>
        </PatientListObserverProvider>
      </PatientListApiProvider>
    </PatientListStateProvider>
  );
}
