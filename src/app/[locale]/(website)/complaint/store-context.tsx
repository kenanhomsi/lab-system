"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createComplaintStore, type ComplaintStoreState } from "./store";

const {
  Provider: ComplaintFeatureStoreProvider,
  useStore: useComplaintFeatureStore,
  useStoreApi: useComplaintFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: ComplaintExtrasContext,
} = createComponentWithProvider<ComplaintStoreState, undefined>(() =>
  createComplaintStore(),
);

export {
  ComplaintFeatureStoreProvider,
  useComplaintFeatureStore,
  useComplaintFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ComplaintExtrasContext,
};
