"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createPatientListStore, type PatientListStoreState } from "./store";

const {
  Provider: PatientListFeatureStoreProvider,
  useStore: usePatientListFeatureStore,
  useStoreApi: usePatientListFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: PatientListExtrasContext,
} = createComponentWithProvider<PatientListStoreState, undefined>(() => createPatientListStore());

export {
  PatientListFeatureStoreProvider,
  usePatientListFeatureStore,
  usePatientListFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  PatientListExtrasContext,
};
