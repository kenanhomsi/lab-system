"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createTestsStore, type TestsStoreState } from "./store";

const {
  Provider: TestsFeatureStoreProvider,
  useStore: useTestsFeatureStore,
  useStoreApi: useTestsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: TestsExtrasContext,
} = createComponentWithProvider<TestsStoreState, undefined>(() => createTestsStore());

export {
  TestsFeatureStoreProvider,
  useTestsFeatureStore,
  useTestsFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  TestsExtrasContext,
};
