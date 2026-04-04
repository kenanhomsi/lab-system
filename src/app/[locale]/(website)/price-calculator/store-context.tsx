"use client";

import { createComponentWithProvider } from "@/hooks/store-provider/factory";
import {
  createPriceCalculatorStore,
  type PriceCalculatorStoreState,
} from "./store";

const {
  Provider: PriceCalculatorFeatureStoreProvider,
  useStore: usePriceCalculatorFeatureStore,
  useStoreApi: usePriceCalculatorFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  ExtrasContext: PriceCalculatorExtrasContext,
} = createComponentWithProvider<PriceCalculatorStoreState, undefined>(() =>
  createPriceCalculatorStore(),
);

export {
  PriceCalculatorFeatureStoreProvider,
  usePriceCalculatorFeatureStore,
  usePriceCalculatorFeatureStoreApi,
  useSyncFrom,
  useCallAction,
  useSubscribeAction,
  PriceCalculatorExtrasContext,
};
