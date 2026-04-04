"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createRequestTestsStore, type RequestTestsStoreState } from "./store";

const {
  Provider: RequestTestsFeatureStoreProvider,
  useStore: useRequestTestsFeatureStore,
  useStoreApi: useRequestTestsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: RequestTestsExtrasContext,
} = createComponentWithProvider<RequestTestsStoreState, undefined>(() => createRequestTestsStore());

export {
  RequestTestsFeatureStoreProvider,
  useRequestTestsFeatureStore,
  useRequestTestsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  RequestTestsExtrasContext,
};
