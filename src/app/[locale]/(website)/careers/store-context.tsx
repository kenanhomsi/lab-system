"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createCareersStore, type CareersStoreState } from "./store";

const {
  Provider: CareersFeatureStoreProvider,
  useStore: useCareersFeatureStore,
  useStoreApi: useCareersFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: CareersExtrasContext,
} = createComponentWithProvider<CareersStoreState, undefined>(() => createCareersStore());

export {
  CareersFeatureStoreProvider,
  useCareersFeatureStore,
  useCareersFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  CareersExtrasContext,
};
