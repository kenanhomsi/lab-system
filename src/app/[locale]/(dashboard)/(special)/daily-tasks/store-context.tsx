"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createDailyTasksStore, type DailyTasksStoreState } from "./store";

const {
  Provider: DailyTasksFeatureStoreProvider,
  useStore: useDailyTasksFeatureStore,
  useStoreApi: useDailyTasksFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: DailyTasksExtrasContext,
} = createComponentWithProvider<DailyTasksStoreState, undefined>(() => createDailyTasksStore());

export {
  DailyTasksFeatureStoreProvider,
  useDailyTasksFeatureStore,
  useDailyTasksFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  DailyTasksExtrasContext,
};
