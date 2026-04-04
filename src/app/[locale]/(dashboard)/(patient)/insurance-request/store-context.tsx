"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createInsuranceRequestStore, type InsuranceRequestStoreState } from "./store";

const {
  Provider: InsuranceRequestFeatureStoreProvider,
  useStore: useInsuranceRequestFeatureStore,
  useStoreApi: useInsuranceRequestFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: InsuranceRequestExtrasContext,
} = createComponentWithProvider<InsuranceRequestStoreState, undefined>(() =>
  createInsuranceRequestStore(),
);

export {
  InsuranceRequestFeatureStoreProvider,
  useInsuranceRequestFeatureStore,
  useInsuranceRequestFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  InsuranceRequestExtrasContext,
};
