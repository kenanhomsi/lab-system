import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type StoreCartUiState } from "./state";
import { initialApiState, type StoreCartApiSliceState } from "./api";
import { initialUtilsState, type StoreCartUtilsState } from "./utils";

export type StoreCartStoreState = StoreCartUiState &
  StoreCartApiSliceState &
  StoreCartUtilsState;

export function createInitialStoreCartState(): StoreCartStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createStoreCartStore() {
  return createStoreApi<StoreCartStoreState>(createInitialStoreCartState());
}
