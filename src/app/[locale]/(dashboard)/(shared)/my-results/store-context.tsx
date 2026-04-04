"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createMyResultsStore, type MyResultsStoreState } from "./store";

const {
  Provider: MyResultsFeatureStoreProvider,
  useStore: useMyResultsFeatureStore,
  useStoreApi: useMyResultsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: MyResultsExtrasContext,
} = createComponentWithProvider<MyResultsStoreState, undefined>(() => createMyResultsStore());

export {
  MyResultsFeatureStoreProvider,
  useMyResultsFeatureStore,
  useMyResultsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  MyResultsExtrasContext,
};
