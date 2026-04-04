import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type OrderTestsUiState } from "./state";
import { initialApiState, type OrderTestsApiSliceState } from "./api";
import { initialUtilsState, type OrderTestsUtilsState } from "./utils";

export type OrderTestsStoreState = OrderTestsUiState &
  OrderTestsApiSliceState &
  OrderTestsUtilsState;

export function createInitialOrderTestsState(): OrderTestsStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createOrderTestsStore() {
  return createStoreApi<OrderTestsStoreState>(createInitialOrderTestsState());
}
