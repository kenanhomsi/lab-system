import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type StoreOrdersUiState } from "./state";
import { initialApiState, type StoreOrdersApiSliceState } from "./api";
import { initialUtilsState, type StoreOrdersUtilsState } from "./utils";

export type StoreOrdersStoreState = StoreOrdersUiState &
  StoreOrdersApiSliceState &
  StoreOrdersUtilsState;

export function createInitialStoreOrdersState(): StoreOrdersStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createStoreOrdersStore() {
  return createStoreApi<StoreOrdersStoreState>(createInitialStoreOrdersState());
}
