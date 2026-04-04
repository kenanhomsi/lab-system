import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type StoreCheckoutUiState } from "./state";
import { initialApiState, type StoreCheckoutApiSliceState } from "./api";
import { initialUtilsState, type StoreCheckoutUtilsState } from "./utils";

export type StoreCheckoutStoreState = StoreCheckoutUiState &
  StoreCheckoutApiSliceState &
  StoreCheckoutUtilsState;

export function createInitialStoreCheckoutState(): StoreCheckoutStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createStoreCheckoutStore() {
  return createStoreApi<StoreCheckoutStoreState>(createInitialStoreCheckoutState());
}
