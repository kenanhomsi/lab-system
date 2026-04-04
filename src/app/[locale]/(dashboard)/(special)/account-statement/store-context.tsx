"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import { createAccountStatementStore, type AccountStatementStoreState } from "./store";

const {
  Provider: AccountStatementFeatureStoreProvider,
  useStore: useAccountStatementFeatureStore,
  useStoreApi: useAccountStatementFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: AccountStatementExtrasContext,
} = createComponentWithProvider<AccountStatementStoreState, undefined>(() =>
  createAccountStatementStore(),
);

export {
  AccountStatementFeatureStoreProvider,
  useAccountStatementFeatureStore,
  useAccountStatementFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  AccountStatementExtrasContext,
};
